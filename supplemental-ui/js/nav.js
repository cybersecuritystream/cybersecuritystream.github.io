/* eslint-disable no-var */
;(function () {
  'use strict'

  var _ = {
    home: 'Home',
    currentVersion: 'Current version',
    previousVersions: 'Previous versions',
    prereleaseVersions: 'Prerelease versions',
  }

  function buildNav (navData, nav, page) {
    if (!page) return
    loadStrings()
    if (nav.classList.contains('fit')) {
      ;(fitNav = fitNav.bind(nav))() // eslint-disable-line no-func-assign
      window.addEventListener('scroll', fitNav)
      window.addEventListener('resize', fitNav)
    }
    relativize = relativize.bind(null, page.url) // eslint-disable-line no-func-assign
    var navGroups = createElement('.nav-groups.scrollbar')
    reshapeNavData(navData).groups.forEach(function (groupData) {
      var navGroup = createElement('.nav-group')
      if (groupData.title) navGroup.appendChild(createNavTitleForGroup(groupData))
      navGroup.appendChild(createNavListForGroup(groupData, page))
      navGroups.appendChild(navGroup)
    })
    navGroups.addEventListener('mousedown', inhibitSelectionOnSecondClick)
    getNavGroupsBottom = getNavGroupsBottom.bind(navGroups) // eslint-disable-line no-func-assign
    closeVersionMenu = closeVersionMenu.bind(nav) // eslint-disable-line no-func-assign
    nav.addEventListener('click', closeVersionMenu)
    nav.appendChild(navGroups)
    scrollToCurrentPageItem(navGroups, page.scope)
  }

  function extractNavData (source) {
    var components = source.siteNavigationData
    var homeUrl = components.homeUrl
    if (!homeUrl) homeUrl = (homeUrl = document.querySelector('a.home-link')) ? homeUrl.getAttribute('href') : '/'
    delete components.homeUrl
    var subcomponents = components.subcomponents || []
    delete components.subcomponents
    var groups = components.groups || [{ root: true, components: ['home', '*'] }]
    delete components.groups
    delete source.siteNavigationData
    return { homeUrl: homeUrl, components: components, subcomponents: subcomponents, groups: groups }
  }

  function getPage () {
    var head = document.head
    var pageComponentMeta = head.querySelector('meta[name=page-component]')
    if (!pageComponentMeta) return
    var pageVersion = head.querySelector('meta[name=page-version]').getAttribute('content')
    if (pageVersion === 'master') pageVersion = ''
    return {
      component: pageComponentMeta.getAttribute('content'),
      version: pageVersion,
      url: head.querySelector('meta[name=page-url]').getAttribute('content'),
      navItemToggleIconId: document.getElementById('icon-nav-item-toggle') && 'icon-nav-item-toggle',
      navVersionIconId: document.getElementById('icon-nav-version') && 'icon-nav-version',
    }
  }

  function reshapeNavData (data) {
    var groupIconId = document.getElementById('icon-nav-group') && 'icon-nav-group'
    var componentIconId = document.getElementById('icon-nav-component') && 'icon-nav-component'
    var components = appendHomeComponent(data.components, data.homeUrl).reduce(function (componentsAccum, component) {
      var versions
      var iconId = 'icon-nav-component-' + component.name
      componentsAccum[component.name] = component = Object.assign({}, component, {
        iconId: document.getElementById(iconId) ? iconId : componentIconId,
        versions: component.versions.reduce(function (versionsAccum, version) {
          var versionName = version.version === 'master' ? '' : version.version
          versionsAccum[versionName] = version = Object.assign({}, version, {
            version: versionName,
            nav: Object.assign({ items: [] }, version.sets[0]),
          })
          if (versionName && !version.displayVersion) version.displayVersion = versionName
          version.sets.slice(1).forEach(function (set) {
            version.nav.items = version.nav.items.concat(set.items) // quick fix to merge multiple sets together
          })
          delete version.sets
          return versionsAccum
        }, (versions = {})),
      })
      if ('' in versions && Object.keys(versions).length === 1) {
        Object.defineProperty(component, 'nav', {
          get: function () {
            return this.versions[''].nav
          },
        })
        component.unversioned = true
      }
      return componentsAccum
    }, {})
    var componentPool = Object.assign({}, components)
    var parent
    data.subcomponents.forEach(function (subcomponent) {
      var targetComponent = components[(parent = subcomponent.parent)]
      if (!(targetComponent || {}).unversioned) {
        console.warn("parent component '" + parent + "' " + (targetComponent ? 'cannot be versioned' : 'not found'))
        return
      }
      var targetItems = targetComponent.nav.items
      Object.values(selectComponents(subcomponent.components, componentPool)).forEach(function (component) {
        var iconId = 'icon-nav-component-' + component.name
        component.iconId = document.getElementById(iconId) ? iconId : targetComponent.iconId
        targetItems.push(component)
      })
    })
    var groups = data.groups.reduce(function (groupsAccum, group) {
      var groupComponents
      groupsAccum.push({
        iconId: groupIconId,
        components: (groupComponents = Object.values(selectComponents(group.components, componentPool))),
        title: group.title,
      })
      var component
      if (!groupComponents.length) {
        groupsAccum.pop()
      } else if (groupComponents.length === 1 && (component = groupComponents[0]).unversioned) {
        component.nav.items.forEach(function (it) {
          var iconId = it.url
            ? 'icon-nav-page' + it.url.replace(/(?:\.html|\/)$/, '').replace(/\//g, '-')
            : 'icon-nav-page-' + component.name + '-' + it.content.toLowerCase().replace(/ +/g, '-')
          if (document.getElementById(iconId)) it.iconId = iconId
        })
      }
      return groupsAccum
    }, [])
    return { components: components, groups: groups }
  }

  function appendHomeComponent (components, homeUrl) {
    var found = components.some(function (candidate) {
      return candidate.name === 'home'
    })
    if (found) return components
    return components.concat({
      name: 'home',
      title: _.home,
      versions: [{ version: '', sets: [{ content: _.home, url: homeUrl }] }],
    })
  }

  function selectComponents (patterns, pool) {
    return coerceToArray(patterns).reduce(function (accum, pattern) {
      if (~pattern.indexOf('*')) {
        var rx = new RegExp('^' + pattern.replace(/[*]/g, '.*?') + '$')
        Object.keys(pool).forEach(function (candidate) {
          if (rx.test(candidate)) {
            accum[candidate] = pool[candidate]
            delete pool[candidate]
          }
        })
      } else if (pattern in pool) {
        accum[pattern] = pool[pattern]
        delete pool[pattern]
      } else if (pattern in accum) {
        var component = accum[pattern] // reinsert previously selected entry
        delete accum[pattern]
        accum[pattern] = component
      } else if (pattern.charAt() === '!' && (pattern = pattern.substr(1)) in accum) {
        delete accum[pattern]
      }
      return accum
    }, {})
  }

  function createNavTitleForGroup (groupData) {
    var navTitle = createElement('h3.nav-title', groupData.title)
    if (groupData.iconId) {
      navTitle.classList.add('has-icon')
      navTitle.insertBefore(createSvgElement('.icon.nav-group-icon', '#' + groupData.iconId), navTitle.firstChild)
    }
    return navTitle
  }

  function createNavListForGroup (groupData, page) {
    var componentsData = groupData.components
    if (componentsData.length === 1 && componentsData[0].unversioned && componentsData[0].nav.items.length) {
      return createNavList(componentsData[0].nav, page)
    }
    var navList = createElement('ul.nav-list')
    componentsData.forEach(function (componentData) {
      navList.appendChild(createNavItemForComponent(componentData, page))
    })
    return navList
  }

  function createNavItemForComponent (componentData, page) {
    var componentName = componentData.name
    var navItem = createElement('li.nav-item', { dataset: { component: componentName } })
    navItem.appendChild(createNavTitle(navItem, componentData, page))
    var versionData
    if (page.component === componentName) {
      versionData = componentData.versions[page.version]
    } else if (isSubcomponent(page.component, componentData)) {
      versionData = componentData.versions['']
    } else {
      return navItem
    }
    if (versionData.nav) page.scope = navItem.appendChild(createNavList(versionData.nav, page, versionData.version))
    navItem.classList.add('is-active')
    return navItem
  }

  function createNavTitle (navItem, componentData, page) {
    var navTitle = createElement('.nav-title')
    var navLink = createElement('a.link.nav-text', componentData.title)
    if (componentData.name === 'home') {
      var homeUrl = componentData.nav.url
      if ((navLink.href = relativize(homeUrl)) === relativize(page.url)) {
        navItem.classList.add('is-active')
        navLink.setAttribute('aria-current', 'page')
      }
    } else {
      navLink.addEventListener('click', toggleNav.bind(navItem, componentData, false, page))
    }
    if (componentData.iconId) {
      navTitle.classList.add('has-icon')
      navLink.insertBefore(createSvgElement('.icon.nav-icon', '#' + componentData.iconId), navLink.firstChild)
    }
    navTitle.appendChild(navLink)
    if (!componentData.unversioned) navTitle.appendChild(createNavVersionDropdown(navItem, componentData, page))
    return navTitle
  }

  function createNavVersionDropdown (navItem, componentData, page) {
    var versions = Object.values(componentData.versions)
    var currentVersionData =
      versions.length > 1
        ? versions.find(function (version) {
          return !version.prerelease
        }) || versions[0]
        : versions[0]
    var navVersionDropdown = createElement('.nav-version-dropdown')
    navVersionDropdown.addEventListener('click', trapEvent)
    var navVersionButton = createElement('button.button.nav-version-button')
    var activeVersion = componentData.name === page.component ? page.version : currentVersionData.version
    var activeDisplayVersion = componentData.versions[activeVersion].displayVersion
    navVersionButton.appendChild(
      createElement('span.nav-version', { dataset: { version: activeVersion } }, activeDisplayVersion)
    )
    if (page.navVersionIconId) {
      navVersionButton.appendChild(createSvgElement('.icon.nav-version-icon', '#' + page.navVersionIconId))
    }
    var navVersionMenu = createElement('ul.nav-version-menu')
    versions.reduce(function (lastVersionData, versionData) {
      if (versionData === currentVersionData) {
        navVersionMenu.appendChild(createElement('li.nav-version-label', _.currentVersion))
      } else if (versionData.prerelease) {
        if (!lastVersionData) navVersionMenu.appendChild(createElement('li.nav-version-label', _.prereleaseVersions))
      } else if (lastVersionData === currentVersionData) {
        navVersionMenu.appendChild(createElement('li.nav-version-label', _.previousVersions))
      }
      var versionDataset = { version: versionData.version }
      navVersionMenu
        .appendChild(createElement('li.nav-version-option', { dataset: versionDataset }, versionData.displayVersion))
        .addEventListener('click', selectVersion.bind(navVersionMenu, navItem, componentData, page))
      return versionData
    }, undefined)
    navVersionButton.addEventListener('click', toggleVersionMenu.bind(navVersionMenu))
    navVersionDropdown.appendChild(navVersionButton)
    navVersionDropdown.appendChild(navVersionMenu)
    return navVersionDropdown
  }

  function createNavList (navEntryData, page, version, lineage) {
    var navList = createElement('ul.nav-list')
    if (version) navList.dataset.version = version
    navEntryData.items.forEach(function (navItemData) {
      if (navItemData.name) {
        navList.appendChild(createNavItemForComponent(navItemData, page))
        return
      }
      var navItem = createElement('li.nav-item')
      if (navItemData.url) {
        var navLink = createElement('a.link.nav-text', { href: relativize(navItemData.url) }, navItemData.content)
        if (navItemData.iconId) {
          navLink.classList.add('has-icon')
          navLink.insertBefore(createSvgElement('.icon.nav-icon', '#' + navItemData.iconId), navLink.firstChild)
        }
        if (navItemData.url === page.url) {
          ;(lineage || []).forEach(function (el) {
            el.classList.add('is-active')
          })
          navItem.classList.add('is-active')
          navLink.setAttribute('aria-current', 'page')
        }
        navItem.appendChild(navLink)
      } else {
        navItem.appendChild(createElement('span.nav-text', navItemData.content))
        if (navItemData.items) navItem.lastChild.addEventListener('click', toggleSubNav.bind(navItem))
      }
      if (navItemData.items) {
        var navItemToggle = createElement('button.nav-item-toggle')
        if (page.navItemToggleIconId) {
          navItemToggle.appendChild(createSvgElement('.icon.nav-item-toggle-icon', '#' + page.navItemToggleIconId))
        }
        navItemToggle.addEventListener('click', toggleSubNav.bind(navItem))
        navItem.insertBefore(navItemToggle, navItem.firstChild)
        navItem.appendChild(createNavList(navItemData, page, undefined, (lineage || []).concat(navItem)))
      }
      navList.appendChild(navItem)
    })
    return navList
  }

  function ensureNavList (navItem, componentData, selectedVersion, page) {
    if (componentData.unversioned) {
      if (!navItem.querySelector('.nav-list')) navItem.appendChild(createNavList(componentData.nav, page))
      return
    }
    var versionData
    var navVersion = navItem.querySelector('.nav-version')
    if (selectedVersion) {
      navVersion.dataset.version = selectedVersion
      versionData = componentData.versions[selectedVersion]
      navVersion.textContent = versionData.displayVersion
    } else {
      selectedVersion = navVersion.dataset.version
      versionData = componentData.versions[selectedVersion]
    }
    var navList = navItem.querySelector('.nav-list[data-version="' + selectedVersion + '"]')
    var firstNavList = navItem.querySelector('.nav-list[data-version]')
    if (navList) {
      if (navList !== firstNavList) navItem.insertBefore(navList, firstNavList)
    } else {
      navList = createNavList(versionData.nav, page, selectedVersion)
      firstNavList ? navItem.insertBefore(navList, firstNavList) : navItem.appendChild(navList)
    }
  }

  function createElement (name, attrs, innerHTML) {
    if (typeof attrs === 'string') {
      innerHTML = attrs
      attrs = undefined
    }
    if (~name.indexOf('.')) {
      var nameParts = name.split('.')
      name = nameParts.shift() || 'div'
      ;(attrs || (attrs = {})).className = nameParts.join(' ')
    }
    var element = document.createElement(name)
    if (attrs) {
      var dataset = attrs.dataset
      if (dataset) {
        delete attrs.dataset
        Object.assign(Object.assign(element, attrs).dataset, dataset)
      } else {
        Object.assign(element, attrs)
      }
    }
    if (innerHTML) element.innerHTML = innerHTML
    return element
  }

  function createSvgElement (attrs, useRef) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', svg.namespaceURI)
    svg.setAttribute('width', '1em')
    svg.setAttribute('height', '1em')
    if (typeof attrs === 'string' && attrs.charAt() === '.') attrs = { className: attrs.split('.').slice(1).join(' ') }
    if (attrs) {
      var className = attrs.className
      if (className) {
        svg.setAttribute('class', className)
        delete attrs.className
      }
      Object.assign(svg, attrs)
    }
    if (useRef) {
      var use = document.createElementNS(svg.namespaceURI, 'use')
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', useRef)
      svg.appendChild(use)
    }
    return svg
  }

  function toggleNav (componentData, selectedVersion, page) {
    if (!selectedVersion && this.classList.contains('is-active')) return this.classList.remove('is-active')
    ensureNavList(this, componentData, selectedVersion, page)
    this.classList[selectedVersion ? 'add' : 'toggle']('is-active')
  }

  function toggleSubNav () {
    this.classList.toggle('is-active')
  }

  function selectVersion (navItem, componentData, page, e) {
    toggleNav.call(navItem, componentData, e.target.dataset.version, page)
    hideVersionMenu(this)
  }

  function toggleVersionMenu () {
    if (hideVersionMenu(this)) return
    var maxBottom = getNavGroupsBottom()
    var height = this.dataset.height
    if (!height) {
      var measurement = document.body.appendChild(
        createElement('div', { style: 'position: absolute; top: 0; left: 0; visibility: hidden' })
      )
      var thisClone = Object.assign(this.cloneNode(true), {
        style: 'max-height: none; position: static; transform: none; transition: none',
      })
      this.dataset.height = height = measurement.appendChild(thisClone).getBoundingClientRect().height.toFixed(1) + 'px'
      measurement.parentNode.removeChild(measurement)
    }
    closeVersionMenu()
    this.style.marginTop = null
    var bottom = this.getBoundingClientRect().top + parseFloat(height) + 20
    if (bottom > maxBottom) this.style.marginTop = maxBottom - bottom + 'px'
    this.classList.remove('is-clipped')
    this.style.maxHeight = height
    this.classList.add('is-active')
  }

  function getNavGroupsBottom () {
    return this.getBoundingClientRect().bottom
  }

  function closeVersionMenu (e) {
    var visibleMenu = this.querySelector('.nav-version-menu.is-active')
    if (visibleMenu) hideVersionMenu(visibleMenu, true)
    if (e) trapEvent(e)
  }

  function hideVersionMenu (menu, force) {
    if (!(force || menu.classList.contains('is-active'))) return
    menu.classList.add('is-clipped')
    menu.style.maxHeight = 0
    menu.classList.remove('is-active')
    return true
  }

  function trapEvent (e) {
    e.stopPropagation()
  }

  function fitNav () {
    if (window.getComputedStyle(this).position === 'fixed' || window.scrollY === 0) {
      this.style.maxHeight = null
      return
    }
    var offset = this.getBoundingClientRect().top
    this.style.maxHeight = offset > 0 ? 'calc(100vh - ' + offset + 'px)' : 'none'
  }

  function scrollToCurrentPageItem (container, scope) {
    container.scrollTop = 0
    if (!scope) return
    var target = (scope.querySelector('[aria-current=page]') || { parentNode: scope.previousElementSibling }).parentNode
    var containerRect = container.getBoundingClientRect()
    var midpoint = containerRect.height * 0.5
    var offset = target.offsetTop + target.offsetHeight * 0.5
    while (container.contains((target = target.offsetParent))) offset += target.offsetTop
    var adjustment = offset - midpoint
    if (adjustment > 0) container.scrollTop = adjustment
  }

  function inhibitSelectionOnSecondClick (e) {
    if (e.detail > 1) e.preventDefault()
  }

  function isSubcomponent (name, componentData) {
    return (
      componentData.unversioned &&
      componentData.nav.items.some(function (candidate) {
        return candidate.name === name
      })
    )
  }

  function relativize (from, to) {
    if (!(from && to.charAt() === '/')) return to
    var hash = ''
    var hashIdx = to.indexOf('#')
    if (~hashIdx) {
      hash = to.substr(hashIdx)
      to = to.substr(0, hashIdx)
    }
    if (from === to) return hash || (to.charAt(to.length - 1) === '/' ? './' : to.substr(to.lastIndexOf('/') + 1))
    return (
      (computeRelativePath(from.slice(0, from.lastIndexOf('/')), to) || '.') +
      (to.charAt(to.length - 1) === '/' ? '/' + hash : hash)
    )
  }

  function computeRelativePath (from, to) {
    var fromParts = trimArray(from.split('/'))
    var toParts = trimArray(to.split('/'))
    var sharedPathLength = Math.min(fromParts.length, toParts.length)
    for (var i = 0; i < sharedPathLength; i++) {
      if (fromParts[i] === toParts[i]) continue
      sharedPathLength = i
      break
    }
    var outputParts = []
    for (var remain = fromParts.length - sharedPathLength; remain > 0; remain--) outputParts.push('..')
    return outputParts.concat(toParts.slice(sharedPathLength)).join('/')
  }

  function trimArray (arr) {
    var start = 0
    var end = arr.length
    for (; start < end; start++) {
      if (arr[start]) break
    }
    if (start === end) return []
    for (; end > 0; end--) {
      if (arr[end - 1]) break
    }
    return arr.slice(start, end)
  }

  function coerceToArray (val) {
    return Array.isArray(val) ? val : [val]
  }

  function loadStrings () {
    var dataset = (document.getElementById('navigator-script') || {}).dataset
    if (!dataset) return
    Object.keys(_).forEach(function (key) {
      _[key] = dataset['t' + key.charAt().toUpperCase() + key.slice(1)] || _[key]
    })
  }

  buildNav(extractNavData(window), document.querySelector('.nav'), getPage())
})()

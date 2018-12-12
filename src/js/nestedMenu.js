/**
 * @param {*} obj
 * @returns {boolean}
 */
function isElement(obj) {
  return (
    typeof HTMLElement === "object" ? obj instanceof HTMLElement :
      obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
  );
}

/**
 * @param {function} callback
 * @param {number} delay
 * @returns {Function}
 */
function throttle(callback, delay = 0) {
  let last;
  let timer;
  return function () {
    const context = this;
    const now = +new Date();
    const args = arguments;
    if (last && now < last + delay) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        callback.apply(context, args);
      }, delay);
    } else {
      last = now;
      callback.apply(context, args);
    }
  };
}


class NestedMenu {
  /**
   * @param element
   * @param options
   */
  constructor(element, options) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;
    if (!isElement(this.container)) {
      this._log('Passed element not found');
      return;
    }

    const defaultOptions = {
      subMenuSelector:      '.sub-menu',
      titleClass:           'back-menu',
      activeClass:          'active',
      responsive:           'false',
      responsiveBreakPoint: 768,
      silent:               true
    };

    this.options = Object.assign({}, defaultOptions, options);
    this.subMenus = this.container.querySelectorAll(this.options.subMenuSelector);
    this._addEventListeners = this._addEventListeners.bind(this);
    this.enabled = false;
    this.init();
  }

  init() {
    this._addEventListeners();
    this._activate();
  }

  _activate() {
    this._calculateWidth();
    if (((this.options.responsive && this.width < this.options.responsiveBreakPoint) || !this.options.responsive)) {
      if (!this.enabled) {
        this.subMenus.forEach((submenu) => {
          const submenuParent = submenu.parentNode;
          const link = submenuParent.querySelector(':scope > a');
          const title = link.cloneNode(true);
          submenu.insertBefore(title, submenu.firstChild);
          title.classList.add(this.options.titleClass);
          submenuParent.classList.add('has-submenu');

          link.addEventListener('click', () => {
            submenu.classList.add(this.options.activeClass);
          });

          title.addEventListener('click', () => {
            submenu.classList.remove(this.options.activeClass);
          })
        });
        this.enabled = true;
      }
    } else if (this.enabled) {
      this._deactivate();
      this.enabled = false;
    }
  }

  /**
   * @private
   */
  _deactivate() {
    this.subMenus.forEach((submenu) => {
      const title =  submenu.querySelector(`.${this.options.titleClass}`);
      const submenuParent = submenu.parentNode;
      const link = submenuParent.querySelector(':scope > a');

      title.parentNode.removeChild(title);

      submenuParent.classList.remove('has-submenu');
      //Remove all event listeners
      link.parentNode.replaceChild(link.cloneNode(true), link);
    });
  }

  /**
   * @private
   */
  _calculateWidth() {
    const e = document.documentElement;
    const g = document.getElementsByTagName('body')[0];
    this.width = window.innerWidth || e.clientWidth || g.clientWidth;
  }

  /**
   * @private
   */
  _addEventListeners() {
    window.addEventListener('resize', throttle(() => {
      this._activate();
    }, 100));
  }

  /**
   * @param message
   * @private
   */
  _log(message) {
    if (this.options.silent) {
      console.error(message);
    }
  }
}

module.exports = NestedMenu;



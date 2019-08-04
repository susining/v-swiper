import Swiper from 'swiper';

//

// http://idangero.us/swiper/api/#events
var SWIPER_EVENTS = [
  "beforeDestroy",
  "slideChange",
  "slideChangeTransitionStart",
  "slideChangeTransitionEnd",
  "slideNextTransitionStart",
  "slideNextTransitionEnd",
  "slidePrevTransitionStart",
  "slidePrevTransitionEnd",
  "transitionStart",
  "transitionEnd",
  "touchStart",
  "touchMove",
  "touchMoveOpposite",
  "sliderMove",
  "touchEnd",
  "click",
  "tap",
  "doubleTap",
  "imagesReady",
  "progress",
  "reachBeginning",
  "reachEnd",
  "fromEdge",
  "setTranslate",
  "setTransition",
  "resize"
];

var script = {
  props: {
    options: {
      type: Object,
      default: function () { return ({}); }
    },
    manulCreate: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      swiper: null
    };
  },
  mounted: function mounted() {
    if (!this.manulCreate) {
      this.createSiwper();
    }
  },
  updated: function updated() {
    this.update();
  },
  beforeDestory: function beforeDestory() {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.destroy();
    });
  },
  methods: {
    create: function create() {
      if (!this.swiper) {
        this.swiper = new Swiper(this.$refs.swiper, this.options);
        this.bindEvents();
      }
    },
    destroy: function destroy() {
      if (this.swiper) {
        this.swiper.destroy && this.swiper.destroy();
        delete this.swiper;
      }
    },
    update: function update() {
      if (this.swiper) {
        this.swiper.update && this.swiper.update();
        this.swiper.navigation && this.swiper.navigation.update();
        this.swiper.pagination && this.swiper.pagination.render();
        this.swiper.pagination && this.swiper.pagination.update();
      }
    },
    bindEvents: function bindEvents() {
      var self = this;
      SWIPER_EVENTS.forEach(function (event) {
        self.swiper.on(event, function() {
          var i = arguments.length, argsArray = Array(i);
          while ( i-- ) argsArray[i] = arguments[i];

          self.$emit.apply(self, [ event ].concat( argsArray ));
          self.$emit.apply(
            self, [ event.replace(/([A-Z])/g, "-$1").toLowerCase() ].concat( argsArray )
          );
        });
      });
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "v-swiper" },
    [
      _c(
        "div",
        { ref: "swiper", staticClass: "swiper-container" },
        [
          _c("div", { staticClass: "swiper-wrapper" }, [_vm._t("default")], 2),
          _vm._v(" "),
          _vm._t("container")
        ],
        2
      ),
      _vm._v(" "),
      _vm._t("outer")
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-e54bb81a_0", { source: "\n.v-swiper {\r\n  position: relative;\n}\r\n", map: {"version":3,"sources":["D:\\repositories\\vue-swiper\\src\\VSwiper.vue"],"names":[],"mappings":";AAgHA;EACA,kBAAA;AACA","file":"VSwiper.vue","sourcesContent":["<template>\r\n  <div class=\"v-swiper\">\r\n    <div ref=\"swiper\" class=\"swiper-container\">\r\n      <div class=\"swiper-wrapper\">\r\n        <slot />\r\n      </div>\r\n      <slot name=\"container\" />\r\n    </div>\r\n    <slot name=\"outer\" />\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport Swiper from \"swiper\";\r\n\r\n// http://idangero.us/swiper/api/#events\r\nconst SWIPER_EVENTS = [\r\n  \"beforeDestroy\",\r\n  \"slideChange\",\r\n  \"slideChangeTransitionStart\",\r\n  \"slideChangeTransitionEnd\",\r\n  \"slideNextTransitionStart\",\r\n  \"slideNextTransitionEnd\",\r\n  \"slidePrevTransitionStart\",\r\n  \"slidePrevTransitionEnd\",\r\n  \"transitionStart\",\r\n  \"transitionEnd\",\r\n  \"touchStart\",\r\n  \"touchMove\",\r\n  \"touchMoveOpposite\",\r\n  \"sliderMove\",\r\n  \"touchEnd\",\r\n  \"click\",\r\n  \"tap\",\r\n  \"doubleTap\",\r\n  \"imagesReady\",\r\n  \"progress\",\r\n  \"reachBeginning\",\r\n  \"reachEnd\",\r\n  \"fromEdge\",\r\n  \"setTranslate\",\r\n  \"setTransition\",\r\n  \"resize\"\r\n];\r\n\r\nexport default {\r\n  props: {\r\n    options: {\r\n      type: Object,\r\n      default: () => ({})\r\n    },\r\n    manulCreate: {\r\n      type: Boolean,\r\n      default: false\r\n    }\r\n  },\r\n  data() {\r\n    return {\r\n      swiper: null\r\n    };\r\n  },\r\n  mounted() {\r\n    if (!this.manulCreate) {\r\n      this.createSiwper();\r\n    }\r\n  },\r\n  updated() {\r\n    this.update();\r\n  },\r\n  beforeDestory() {\r\n    this.$nextTick(() => {\r\n      this.destroy();\r\n    });\r\n  },\r\n  methods: {\r\n    create() {\r\n      if (!this.swiper) {\r\n        this.swiper = new Swiper(this.$refs.swiper, this.options);\r\n        this.bindEvents();\r\n      }\r\n    },\r\n    destroy() {\r\n      if (this.swiper) {\r\n        this.swiper.destroy && this.swiper.destroy();\r\n        delete this.swiper;\r\n      }\r\n    },\r\n    update() {\r\n      if (this.swiper) {\r\n        this.swiper.update && this.swiper.update();\r\n        this.swiper.navigation && this.swiper.navigation.update();\r\n        this.swiper.pagination && this.swiper.pagination.render();\r\n        this.swiper.pagination && this.swiper.pagination.update();\r\n      }\r\n    },\r\n    bindEvents() {\r\n      const self = this;\r\n      SWIPER_EVENTS.forEach(event => {\r\n        self.swiper.on(event, function() {\r\n          self.$emit(event, ...arguments);\r\n          self.$emit(\r\n            event.replace(/([A-Z])/g, \"-$1\").toLowerCase(),\r\n            ...arguments\r\n          );\r\n        });\r\n      });\r\n    }\r\n  }\r\n};\r\n</script>\r\n\r\n<style>\r\n.v-swiper {\r\n  position: relative;\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var VSwiper = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

//
//
//
//
//
//

var script$1 = {
  mounted: function mounted() {
    this.update();
  },
  updated: function updated() {
    this.update();
  },
  methods: {
    update: function update() {
      if (this.$parent && this.$parent.swiper) {
        this.$parent.update();
      }
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "swiper-slide" }, [_vm._t("default")], 2)
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-ca404b8c_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"VSwiperSlide.vue"}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var VSwiperSlide = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue) {
    if (install.installed) { return; }
    install.installed = true;
    Vue.component('v-swiper', VSwiper);
    Vue.component('v-swiper-slide', VSwiperSlide);
}

// Create module definition for Vue.use()
var plugin = {
    install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

export default VSwiper;
export { VSwiper, VSwiperSlide, install };

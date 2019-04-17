<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <!--<div class="editor-custom-btn-container">-->
      <!--<editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>-->
    <!--</div>-->
  </div>
</template>

<script>
import editorImage from './components/editorImage'
import plugins from './plugins'
import toolbar from './toolbar'

export default {
  name: 'tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date(),
      fullscreen: false
    }
  },
  watch: {
    // 每次值因任何原因而导致值改变时会都会执行此段代码
    value(val) {
      // console.log('value is being changed')
      // console.log('是否编辑模式', this.hasChange)
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  methods: {
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        language: 'zh_CN',
        // 实例初始化回调函数
        init_instance_callback: editor => {
          // 当第一次改变tinyMce组件绑定的状态时，会运行这个回调，这个回调只运行一次
          console.log('process editor init')
          // _this.value是一个watch的观察对象，一量它发生变化，会触发watch绑定的方法
          // _this.value在这里是作用是改变editor的显示值
          if (_this.value) {
            editor.setContent(_this.value)
          }
          // 初始化后，初始化状态为true
          _this.hasInit = true
          // 在初始化时绑定事件处理代码：当输入文字时，hasChange状态变为true,变为true后。由于业务代码的实现的逻辑是，只要输入了文字，就不再实时更新视图，以免光标跳跃
          // 等于说：1 editor的值改变，绑定值也自动改变，但是，不会触发Vue的视图更新
          // 所以，hasChange为true表示editor的输入状态为真。
          // 但是，需要在结束输入时，恢复更新视图。需要解决这个问题。
          // 当输入内容时，触发 父组件传入的 @input 事件，其实就是v-model隐含的双向绑定的事件。
          // 一旦编辑器的的值输入改变，立即改变组件的绑定的父组件属性值也就是v-model:ruleForm.content
          // 实际效果：当输入文字，即改变ruleForm.content状态值
          /** 一旦v-model绑定的属性ruleForm.content第一次赋值，（input事件被鉵发），tinyMce就再不会自动更新视图了。*/
          editor.on('NodeChange Change KeyUp SetContent', () => {
            // 仅当被次值因输入文字而发生改变时，都会触发此段事件处理代码，而使用代码表达式改变绑定值时，不会鉵发此事件代码
            // console.log('i am type or change the v-model bind value')
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  },
  destroyed() {
    // 当切换页面的时候，它被销毁了
    // console.log('tinyMce is destroyed')
    this.destroyTinymce()
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>

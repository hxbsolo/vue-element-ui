<template>
  <quill-editor
    class="editor"
    v-model="content"
    ref="myQuillEditor"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @change="onEditorChange($event)"
  >
  </quill-editor>
</template>
 
<script>
import { quillEditor } from "vue-quill-editor";
export default {
  props: ["content"],
  data() {
    return {
      editorOption: {},
    };
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quillEditor;
    },
  },
  methods: {
    onEditorBlur() {},
    onEditorFocus(e) {
      //编辑器获得焦点的事件
      console.log(e);
    },
    onEditorChange(e) {
      //内容改变事件
      console.log(e);
    },
  },
};
</script>
 
<style>
</style>
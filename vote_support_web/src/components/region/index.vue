<template>
  <div>
    <el-cascader
      :options="regions"
      @active-item-change="handleLoadChildrenRegion"
      @change="handleRegion"
      :value="regionIdArr"
      style="width: 100%"
      placeholder="请选择地址"
    ></el-cascader>
  </div>
</template>

<script>
import { getInitRegions, getChildrenRegions, getIndexOfRegionIdInRegions } from '../../api/region'

export default {
  name: 'regionsComponent',
  props: {
    // 属性名必须是vlue以使v-model能搭配使用，再加watch行为，实现v-model自动反射
    // 总结：只要子组件拥有value属性，就可以实现v-model自动反射
    value: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  watch: {
    // 每次值因任何原因而导致值改变时会都会执行此段代码
    value(regionIdArr) {
      // $nextTick指加入视图更新队列
      this.$nextTick(() => {
        // ..
        // console.log('当值改变时的自动反射：当前选择的region_id数组', regionIdArr)
        // 使用值改变当前地址组件选项视图
        this.regionIdArr = regionIdArr
      })
    }
  },
  data() {
    return {
      regions: [],
      regionIdArr: []
    }
  },
  mounted() {
    getInitRegions().then(regions => {
      this.regions = regions
    })
  },
  methods: {
    handleLoadChildrenRegion(regionIdArr) {
      // console.log(regionIdArr)
      if (regionIdArr.length === 1) {
        // console.log('添加一级子区域')
        const index = getIndexOfRegionIdInRegions(regionIdArr[0], this.regions)
        if (this.regions[index].children.length === 0) {
          getChildrenRegions(regionIdArr[0]).then(regions => {
            this.regions[index].children = regions
          })
        }
      } else if (regionIdArr.length === 2) {
        // console.log('添加二级子区域')
        // 先获得点击地址的一级区域索引
        const indexLevel1 = getIndexOfRegionIdInRegions(regionIdArr[0], this.regions)
        // 再获得点击地址的二级区域索引
        const indexLevel2 = getIndexOfRegionIdInRegions(regionIdArr[1], this.regions[indexLevel1].children)
        // 获得二级区域的子区域
        if (this.regions[indexLevel1].children[indexLevel2].children.length === 0) {
          getChildrenRegions(regionIdArr[1], false).then(regions => {
            this.regions[indexLevel1].children[indexLevel2].children = regions
          })
        }
      }
      // else if (regionIdArr.length === 3) {
      //   // console.log('添加三级子区域')
      //   // 先获得点击地址的一级区域索引
      //   const indexLevel1 = getIndexOfRegionIdInRegions(regionIdArr[0], this.regions)
      //   // 再获得点击地址的二级区域索引
      //   const indexLevel2 = getIndexOfRegionIdInRegions(regionIdArr[1], this.regions[indexLevel1].children)
      //   // 再获得点击地址的三级区域索引
      //   const indexLevel3 = getIndexOfRegionIdInRegions(regionIdArr[2], this.regions[indexLevel1].children[indexLevel2].children)
      //   // 获得三级区域的子区域
      //   if (this.regions[indexLevel1].children[indexLevel2].children[indexLevel3].children.length === 0) {
      //     getChildrenRegions(regionIdArr[2], false).then(regions => {
      //       this.regions[indexLevel1].children[indexLevel2].children[indexLevel3].children = regions
      //     })
      //   }
      // }
    },
    handleRegion(regionIdArr) {
      // emit触发input事件，返回值。v-model本质上的行为即是：绑定input事件的处理函数，并接收函数的返回值给value,value再改变绑定对象
      this.$emit('input', regionIdArr)
      // console.log('当手动选择改变区域地址id时，触发input事件:将级联组件value并传给v-model所绑定的变量：当前选', regionIdArr)
    }
  }
}
</script>

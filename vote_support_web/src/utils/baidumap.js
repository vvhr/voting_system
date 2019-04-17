export default {
  // [1]-[callback=onBMapCallback] : 表示当地图JSSDK资源载入完毕,回调全局函数(window.[全局函数名])。
  // [2]-[eslint-disable-next-line] : 表示强制屏蔽Eslint代码检查。因为BMap没有引入，正常是不能当模块名直接使用的
  // [3]-[window.onBMapCallback] : 手动定义全局函数作为BMapSDK加载完后的回调函数名
  // [4]-[resolve] : promise对象异步完成后，赋给then方法的回调函数中作为响应值。在这里，promise异步完成后，将BMap对象作为响应值
  // [5]-[BMap] BMap是由百度定义的对象名。
  // 本方法返回一个Promise对象
  init: function() {
    const AK = '1gL8oYI4HA7cqZ15KpApH0GVFLe0hA2Y'
    // [1]-[callback=onBMapCallback]
    const BMap_URL = 'https://api.map.baidu.com/api?v=2.0&ak=' + AK + '&s=1&callback=onBMapCallback'
    return new Promise((resolve, reject) => {
      if (typeof BMap !== 'undefined') {
        // [2]-[eslint-disable-next-line]
        // eslint-disable-next-line
        resolve(BMap)
        return true
      }
      // [3]-[window.onBMapCallback]
      window.onBMapCallback = () => {
        console.log('百度地图脚本初始化成功...')
        // [4]-[resolve]
        // eslint-disable-next-line
        resolve(BMap)
      }
      // 插入script脚本
      const scriptNode = document.createElement('script')
      scriptNode.setAttribute('type', 'text/javascript')
      scriptNode.setAttribute('src', BMap_URL)
      document.body.appendChild(scriptNode)
    })
  }
}

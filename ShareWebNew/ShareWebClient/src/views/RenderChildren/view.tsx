import * as React from 'react'

/**
 * 渲染子组件或填充 <noscript />
 */
const RenderChildren = ({ children }) => children ? children : <noscript />

export default RenderChildren
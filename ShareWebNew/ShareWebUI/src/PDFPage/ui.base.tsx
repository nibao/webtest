import * as React from 'react';

/**
 * 渲染页
 * @param n
 * @private
 */
function renderPage(canvas, pageInfo, watermark) {

    let context = {
        'canvasContext': canvas.getContext('2d'),
        'viewport': pageInfo.viewport
    };

    canvas.width = pageInfo.viewport.width;
    canvas.height = pageInfo.viewport.height;
    canvas.style.width = `${pageInfo.viewport.width / Math.max(window.devicePixelRatio || 1, 2)}px`;
    canvas.style.height = `${pageInfo.viewport.height / Math.max(window.devicePixelRatio || 1, 2)}px`;

    pageInfo.page.render(context).then(() => {
        if (watermark) {
            if (watermark.layout !== 0) {
                context.canvasContext.fillStyle = context.canvasContext.createPattern(watermark.src, 'repeat')
                context.canvasContext.fillRect(0, 0, canvas.width, canvas.height)
            } else {
                context.canvasContext.drawImage(watermark.src, (canvas.width - watermark.src.width) / 2, (canvas.height - watermark.src.height) / 2)
            }
        }
    });
}


/**
 * PDF分页
 * @component
 * @props data PDF页数据
 */
export default class PDFPageBase extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        renderPage(this.refs.canvas, this.props.data, this.props.watermark);
    }
}
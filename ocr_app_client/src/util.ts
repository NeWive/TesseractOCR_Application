//计算图像的灰度值,公式为：Gray = R*0.299 + G*0.587 + B*0.114
function CalculateGrayValue(rValue: number, gValue: number, bValue: number) {
    return parseInt(String(rValue * 0.299 + gValue * 0.587 + bValue * 0.114));
}

//获取图像的灰度图像的信息
function GetGrayImageInfo(canvas: HTMLCanvasElement) {
    let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    let canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (canvasData.data.length == 0) {
        return null;
    }
    return [canvasData, ctx];
}

//一维OTSU图像处理算法
function OTSUAlgorithm(canvas: HTMLCanvasElement) {
    let m_pFstdHistogram = [];//表示灰度值的分布点概率
    let m_pFGrayAccu = [];//其中每一个值等于m_pFstdHistogram中从0到当前下标值的和
    let m_pFGrayAve = [];//其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和
    let m_pAverage = 0;//值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和
    let m_pHistogram = [];//灰度直方图
    let i, j;
    let temp = 0, fMax = 0;//定义一个临时变量和一个最大类间方差的值
    let nThresh = 0;//最优阀值
    //获取灰度图像的信息
    let imageInfo = GetGrayImageInfo(canvas);
    if (imageInfo == null) {
        window.alert("图像还没有转化为灰度图像！");
        return;
    }
    //初始化各项参数
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = 0;
        m_pFGrayAccu[i] = 0;
        m_pFGrayAve[i] = 0;
        m_pHistogram[i] = 0;
    }
    //获取图像信息
    let canvasData = imageInfo[0];
    //获取图像的像素
    // @ts-ignore
    let pixels = canvasData.data;
    //下面统计图像的灰度分布信息
    for (i = 0; i < pixels.length; i += 4) {
        //获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
        let r = pixels[i];
        m_pHistogram[r]++;
    }
    //下面计算每一个灰度点在图像中出现的概率
    // @ts-ignore
    let size = canvasData.width * canvasData.height;
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = m_pHistogram[i] / size;
    }
    //下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
    for (i = 0; i < 256; i++) {
        for (j = 0; j <= i; j++) {
            //计算m_pFGaryAccu[256]
            m_pFGrayAccu[i] += m_pFstdHistogram[j];
            //计算m_pFGrayAve[256]
            m_pFGrayAve[i] += j * m_pFstdHistogram[j];
        }
        //计算平均值
        m_pAverage += i * m_pFstdHistogram[i];
    }
    //下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
    for (i = 0; i < 256; i++) {
        temp = (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])
            * (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])
            / (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]));
        if (temp > fMax) {
            fMax = temp;
            nThresh = i;
        }
    }
    //下面执行二值化过程
    // @ts-ignore
    for (i = 0; i < canvasData.width; i++) {
        // @ts-ignore
        for (j = 0; j < canvasData.height; j++) {
            //取得每一点的位置
            // @ts-ignore
            let ids = (i + j * canvasData.width) * 4;
            //取得像素的R分量的值
            // @ts-ignore
            let r = canvasData.data[ids];
            //与阀值进行比较，如果小于阀值，那么将改点置为0，否则置为255
            let gray = r > nThresh ? 255 : 0;
            // @ts-ignore
            canvasData.data[ids + 0] = gray;
            // @ts-ignore
            canvasData.data[ids + 1] = gray;
            // @ts-ignore
            canvasData.data[ids + 2] = gray;
        }
    }
    let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    // @ts-ignore
    ctx.putImageData(canvasData, 0, 0);
}

/**
 * 对图片进行预处理
 * @param base64
 * @param ref
 */
export function toGrey(base64: string, ref: React.MutableRefObject<null>): Promise<string> {
    return new Promise((res) => {
        let img = new Image();
        img.src = base64;
        img.onload = () => {
            let canvas = <HTMLCanvasElement><unknown>ref.current;
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // 灰度化
            let canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //这个循环是取得图像的每一个点，在计算灰度后将灰度设置给原图像
            for (let x = 0; x < canvasData.width; x++) {
                //alert("x="+x);
                for (let y = 0; y < canvasData.height; y++) {
                    //alert("y="+y);
                    // Index of the pixel in the array
                    let idx = (x + y * canvas.width) * 4;

                    // The RGB values
                    let r = canvasData.data[idx + 0];
                    let g = canvasData.data[idx + 1];
                    let b = canvasData.data[idx + 2];
                    //更新图像数据
                    let gray = CalculateGrayValue(r, g, b);
                    canvasData.data[idx + 0] = gray;
                    canvasData.data[idx + 1] = gray;
                    canvasData.data[idx + 2] = gray;
                }
            }
            ctx.putImageData(canvasData, 0, 0);
            OTSUAlgorithm(canvas);
            res(canvas.toDataURL("image/jpeg", 1));
        }
    });
}

// function createImage(url: string): Promise<HTMLImageElement> {
//     return new Promise((res) => {
//         const img = new Image();
//         img.onload = () => {
//             res(img);
//         }
//         img.src = url;
//     });
// }
//
// function getRadianAngle(degreeValue: number) {
//     return (degreeValue * Math.PI) / 180;
// }
//
// function rotateSize(width: number, height: number, rotation: number) {
//     const rotRad = getRadianAngle(rotation);
//     return {
//         width:
//             Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
//         height:
//             Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
//     }
// }
//
// // @ts-ignore
// export async function getCroppedImg(ref: React.MutableRefObject<null>, imgSrc: string, pixelCrop, rotation: number = 0, flip = { horizontal: false, vertical: false }) {
//     const image = await createImage(imgSrc);
//     const canvas = <HTMLCanvasElement><unknown>ref.current;
//     const ctx = canvas.getContext("2d");
//     const rotRad = getRadianAngle(rotation);
//     const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
//         image.width,
//         image.height,
//         rotation
//     );
//     if (!ctx) {
//         return null
//     }
//     // set canvas size to match the bounding box
//     canvas.width = bBoxWidth;
//     canvas.height = bBoxHeight;
//     ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
//     ctx.rotate(rotRad);
//     ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
//     ctx.translate(-image.width / 2, -image.height / 2);
//     // draw rotated image
//     ctx.drawImage(image, 0, 0);
//     const data = ctx.getImageData(
//         pixelCrop.x,
//         pixelCrop.y,
//         pixelCrop.width,
//         pixelCrop.height
//     );
//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;
//     ctx.putImageData(data, 0, 0);
//     return canvas.toDataURL("image/jpeg", 1);
// }

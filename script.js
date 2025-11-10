// 交互式数据可视化网页 - JavaScript功能实现

// 标签页切换功能
function showTab(tabId) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有标签按钮的激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页内容
    document.getElementById(tabId).classList.add('active');
    
    // 激活对应的标签按钮
    event.target.classList.add('active');
    
    // 根据标签页初始化对应的图表
    initializeChart(tabId);
}

// 根据标签页初始化图表
function initializeChart(tabId) {
    switch(tabId) {
        case 'tab1':
            updateBarChart();
            break;
        case 'tab2':
            updateLineChart();
            break;
        case 'tab3':
            updateTempChart();
            break;
        case 'tab4':
            updateKochSnowflake();
            break;
        case 'tab5':
            updateMarkerDemo();
            break;
    }
}

// 图书采购柱状图
function updateBarChart() {
    const region1Factor = document.getElementById('region1Slider').value / 100;
    const region2Factor = document.getElementById('region2Slider').value / 100;
    const barType = document.getElementById('barType').value;
    
    // 基于原始数据调整
    const bookTypes = ['科普类', '文学类', '历史类', '数学类', '外语类'];
    const region1Data = [120, 150, 90, 110, 130].map(val => val * region1Factor);
    const region2Data = [100, 140, 110, 95, 120].map(val => val * region2Factor);
    
    const trace1 = {
        x: bookTypes,
        y: region1Data,
        name: '地区1',
        type: 'bar',
        marker: {
            color: '#FFCC00',
            line: {
                color: '#E6B800',
                width: 2
            }
        }
    };
    
    const trace2 = {
        x: bookTypes,
        y: region2Data,
        name: '地区2',
        type: 'bar',
        marker: {
            color: '#B0C4DE',
            line: {
                color: '#8DA6C9',
                width: 2
            }
        }
    };
    
    const layout = {
        title: '图书采购情况对比',
        xaxis: { title: '图书类别' },
        yaxis: { title: '采购数量（本）' },
        barmode: barType === 'stacked' ? 'stack' : 'group',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Arial, sans-serif', size: 12 },
        margin: { l: 60, r: 40, t: 60, b: 60 }
    };
    
    Plotly.newPlot('barChart', [trace1, trace2], layout, {
        responsive: true,
        displayModeBar: true
    });
}

// 汇率走势折线图
function updateLineChart() {
    const show2017 = document.getElementById('show2017').checked;
    const show2019 = document.getElementById('show2019').checked;
    const showGrid = document.getElementById('showGrid').checked;
    const smoothLine = document.getElementById('smoothLine').checked;
    
    const dates = ['7月1日', '7月5日', '7月10日', '7月15日', '7月20日', '7月25日', '7月31日'];
    const rates2017 = [6.78, 6.79, 6.77, 6.76, 6.75, 6.74, 6.73];
    const rates2019 = [6.87, 6.88, 6.86, 6.85, 6.84, 6.83, 6.82];
    
    const traces = [];
    
    if (show2017) {
        traces.push({
            x: dates,
            y: rates2017,
            name: '2017年7月美元/人民币汇率',
            type: smoothLine ? 'spline' : 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#006374',
                width: 4,
                dash: 'dash'
            },
            marker: {
                size: 8,
                color: '#006374'
            }
        });
    }
    
    if (show2019) {
        traces.push({
            x: dates,
            y: rates2019,
            name: '2019年7月美元/人民币汇率',
            type: smoothLine ? 'spline' : 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#800080',
                width: 2,
                dash: 'dashdot'
            },
            marker: {
                size: 6,
                color: '#800080'
            }
        });
    }
    
    const layout = {
        title: '美元/人民币汇率走势',
        xaxis: { 
            title: '日期',
            gridcolor: showGrid ? 'rgba(128,128,128,0.2)' : 'rgba(0,0,0,0)'
        },
        yaxis: { 
            title: '汇率',
            gridcolor: showGrid ? 'rgba(128,128,128,0.2)' : 'rgba(0,0,0,0)'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Arial, sans-serif', size: 12 },
        margin: { l: 60, r: 40, t: 60, b: 60 }
    };
    
    Plotly.newPlot('lineChart', traces, layout, {
        responsive: true,
        displayModeBar: true
    });
}

// 温度变化趋势图
function updateTempChart() {
    const showMaxTemp = document.getElementById('showMaxTemp').checked;
    const showMinTemp = document.getElementById('showMinTemp').checked;
    const markerStyle = document.getElementById('markerStyle').value;
    const fillArea = document.getElementById('fillArea').checked;
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const maxTemps = [28, 30, 32, 29, 27, 25, 26];
    const minTemps = [18, 20, 22, 19, 17, 15, 16];
    
    const traces = [];
    
    if (showMaxTemp) {
        traces.push({
            x: days,
            y: maxTemps,
            name: '最高温度',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#FF6B6B', width: 3 },
            marker: {
                symbol: getMarkerSymbol(markerStyle),
                size: 12,
                color: '#FF6B6B'
            }
        });
    }
    
    if (showMinTemp) {
        traces.push({
            x: days,
            y: minTemps,
            name: '最低温度',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#3498DB', width: 3 },
            marker: {
                symbol: getMarkerSymbol(markerStyle),
                size: 12,
                color: '#3498DB'
            }
        });
    }
    
    // 添加填充区域
    if (fillArea && showMaxTemp && showMinTemp) {
        traces.push({
            x: days,
            y: maxTemps,
            type: 'scatter',
            mode: 'lines',
            line: { width: 0 },
            fillcolor: 'rgba(255, 107, 107, 0.3)',
            fill: 'tonexty',
            showlegend: false
        });
        
        traces.push({
            x: days,
            y: minTemps,
            type: 'scatter',
            mode: 'lines',
            line: { width: 0 },
            fillcolor: 'rgba(52, 152, 219, 0.3)',
            fill: 'tonexty',
            showlegend: false
        });
    }
    
    const layout = {
        title: '温度变化趋势图',
        xaxis: { title: '日期' },
        yaxis: { title: '温度 (°C)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Arial, sans-serif', size: 12 },
        margin: { l: 60, r: 40, t: 60, b: 60 }
    };
    
    Plotly.newPlot('tempChart', traces, layout, {
        responsive: true,
        displayModeBar: true
    });
}

// 获取标记符号
function getMarkerSymbol(style) {
    switch(style) {
        case 'star': return 'star';
        case 'circle': return 'circle';
        case 'square': return 'square';
        case 'none': return '';
        default: return 'circle';
    }
}

// 科赫雪花分形图
function updateKochSnowflake() {
    const iteration = parseInt(document.getElementById('iterationSlider').value);
    const color = document.getElementById('snowflakeColor').value;
    const fillMode = document.getElementById('fillMode').value;
    
    // 使用D3.js创建科赫雪花
    const svg = d3.select('#kochChart').html('');
    
    const width = document.getElementById('kochChart').offsetWidth;
    const height = document.getElementById('kochChart').offsetHeight;
    
    const svgContainer = d3.select('#kochChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.25;
    
    // 生成科赫雪花点
    const points = generateKochSnowflake(centerX, centerY, size, iteration);
    
    // 绘制雪花
    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    
    // 创建更华丽的渐变效果
    if (fillMode === 'gradient') {
        const gradient = svgContainer.append('defs')
            .append('radialGradient')
            .attr('id', 'snowflakeGradient')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '70%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', color)
            .attr('stop-opacity', 0.8);
        
        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', d3.color(color).brighter(0.5))
            .attr('stop-opacity', 0.6);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', d3.color(color).brighter(1))
            .attr('stop-opacity', 0.4);
    }
    
    // 创建精美图案
    if (fillMode === 'pattern') {
        const pattern = svgContainer.append('defs')
            .append('pattern')
            .attr('id', 'snowflakePattern')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 15)
            .attr('height', 15);
        
        pattern.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d3.color(color).brighter(0.5));
        
        pattern.append('circle')
            .attr('cx', 7.5)
            .attr('cy', 7.5)
            .attr('r', 2)
            .attr('fill', color)
            .attr('opacity', 0.8);
    }
    
    // 创建发光效果
    const filter = svgContainer.append('defs')
        .append('filter')
        .attr('id', 'snowflakeGlow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    
    filter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '3')
        .attr('result', 'blur');
    
    filter.append('feBlend')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'blur')
        .attr('mode', 'screen');
    
    // 主雪花路径
    const snowflake = svgContainer.append('path')
        .datum(points)
        .attr('d', lineGenerator)
        .attr('fill', fillMode === 'gradient' ? 'url(#snowflakeGradient)' : 
                   fillMode === 'pattern' ? 'url(#snowflakePattern)' : color)
        .attr('stroke', d3.color(color).darker(0.3))
        .attr('stroke-width', 2)
        .attr('fill-opacity', 0.7)
        .attr('filter', 'url(#snowflakeGlow)');
    
    // 添加内部装饰线
    if (iteration > 1) {
        const innerSize = size * 0.7;
        const innerPoints = generateKochSnowflake(centerX, centerY, innerSize, iteration - 1);
        
        svgContainer.append('path')
            .datum(innerPoints)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', d3.color(color).brighter(1))
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);
    }
    
    // 添加背景装饰
    const decorationCount = 6 + iteration * 2;
    for (let i = 0; i < decorationCount; i++) {
        const angle = (i * 2 * Math.PI) / decorationCount;
        const distance = size * 1.3;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        svgContainer.append('circle')
            .attr('cx', centerX + dx)
            .attr('cy', centerY + dy)
            .attr('r', 2 + Math.random() * 3)
            .attr('fill', color)
            .attr('opacity', 0.4);
    }
    
    // 添加晶光效果
    for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI) / 8;
        const distance = size * 1.1;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        svgContainer.append('line')
            .attr('x1', centerX)
            .attr('y1', centerY)
            .attr('x2', centerX + dx)
            .attr('y2', centerY + dy)
            .attr('stroke', d3.color(color).brighter(1))
            .attr('stroke-width', 1)
            .attr('opacity', 0.3)
            .attr('stroke-dasharray', '2,2');
    }
}

// 生成科赫雪花点
function generateKochSnowflake(centerX, centerY, size, iteration) {
    const angle = -Math.PI / 2;
    const points = [];
    
    for (let i = 0; i < 3; i++) {
        const x1 = centerX + size * Math.cos(angle + (i * 2 * Math.PI / 3));
        const y1 = centerY + size * Math.sin(angle + (i * 2 * Math.PI / 3));
        const x2 = centerX + size * Math.cos(angle + ((i + 1) * 2 * Math.PI / 3));
        const y2 = centerY + size * Math.sin(angle + ((i + 1) * 2 * Math.PI / 3));
        
        const segmentPoints = kochCurve(x1, y1, x2, y2, iteration);
        points.push(...segmentPoints);
    }
    
    // 闭合路径
    points.push(points[0]);
    
    return points;
}

// 科赫曲线生成
function kochCurve(x1, y1, x2, y2, iteration) {
    if (iteration === 0) {
        return [{x: x1, y: y1}, {x: x2, y: y2}];
    }
    
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    const x3 = x1 + dx / 3;
    const y3 = y1 + dy / 3;
    
    const x4 = x2 - dx / 3;
    const y4 = y2 - dy / 3;
    
    const angle = Math.PI / 3;
    const x5 = x3 + (dx / 3) * Math.cos(angle) - (dy / 3) * Math.sin(angle);
    const y5 = y3 + (dx / 3) * Math.sin(angle) + (dy / 3) * Math.cos(angle);
    
    const points1 = kochCurve(x1, y1, x3, y3, iteration - 1);
    const points2 = kochCurve(x3, y3, x5, y5, iteration - 1);
    const points3 = kochCurve(x5, y5, x4, y4, iteration - 1);
    const points4 = kochCurve(x4, y4, x2, y2, iteration - 1);
    
    return [...points1.slice(0, -1), ...points2.slice(0, -1), ...points3.slice(0, -1), ...points4];
}

// 雪花动画
function toggleSnowflakeAnimation() {
    const animate = document.getElementById('animateSnowflake').checked;
    
    if (animate) {
        startSnowflakeAnimation();
    } else {
        stopSnowflakeAnimation();
    }
}

let animationInterval;

function startSnowflakeAnimation() {
    let rotation = 0;
    
    animationInterval = setInterval(() => {
        rotation += 1;
        const svg = d3.select('#kochChart svg');
        svg.style('transform', `rotate(${rotation}deg)`);
        svg.style('transform-origin', 'center');
    }, 50);
}

function stopSnowflakeAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        const svg = d3.select('#kochChart svg');
        svg.style('transform', 'rotate(0deg)');
    }
}

// 数据标记样式展示
function updateMarkerDemo() {
    const markerType = document.getElementById('markerType').value;
    const markerSize = parseInt(document.getElementById('markerSize').value);
    const markerColor = document.getElementById('markerColor').value;
    const borderColor = document.getElementById('borderColor').value;
    
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 4, 2];
    
    const trace = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'markers+lines+text',
        marker: {
            symbol: getPlotlyMarkerSymbol(markerType),
            size: markerSize,
            color: markerColor,
            line: {
                color: borderColor,
                width: 2
            }
        },
        line: {
            color: markerColor,
            width: 2,
            dash: 'dash'
        },
        text: ['点A', '点B', '点C', '点D', '点E'],
        textposition: 'top center',
        textfont: {
            family: 'Arial, sans-serif',
            size: 14,
            color: '#2c3e50'
        }
    };
    
    const layout = {
        title: '数据标记样式展示',
        xaxis: { title: 'X轴', range: [0.5, 5.5] },
        yaxis: { title: 'Y轴', range: [0, 7] },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Arial, sans-serif', size: 12 },
        margin: { l: 60, r: 40, t: 60, b: 60 },
        annotations: [
            {
                x: 1.9,
                y: 3.75,
                text: 'y=x+2',
                showarrow: false,
                font: {
                    family: 'serif',
                    size: 18,
                    color: '#e74c3c'
                },
                bgcolor: 'yellow',
                bordercolor: 'black',
                borderwidth: 1,
                borderpad: 4,
                opacity: 0.8
            }
        ]
    };
    
    Plotly.newPlot('markerChart', [trace], layout, {
        responsive: true,
        displayModeBar: true
    });
}

// 获取Plotly标记符号
function getPlotlyMarkerSymbol(type) {
    switch(type) {
        case 'star': return 'star';
        case 'circle': return 'circle';
        case 'square': return 'square';
        case 'diamond': return 'diamond';
        default: return 'circle';
    }
}

// 图表保存功能
function saveChart(chartId, chartName) {
    const formatSelect = document.getElementById(chartId + 'Format');
    const format = formatSelect ? formatSelect.value : 'png';
    const statusElement = document.getElementById(chartId + 'Status');
    
    try {
        if (chartId === 'kochChart') {
            saveSnowflake();
            return;
        }
        
        // 使用Plotly的保存功能
        Plotly.downloadImage(chartId, {
            format: format,
            filename: chartName + '_' + new Date().toISOString().slice(0, 10),
            height: 800,
            width: 1200,
            scale: 2
        }).then(() => {
            showStatus(statusElement, '✅ 图表保存成功！', 'success');
        }).catch(error => {
            showStatus(statusElement, '❌ 保存失败: ' + error.message, 'error');
        });
    } catch (error) {
        showStatus(statusElement, '❌ 保存失败: ' + error.message, 'error');
    }
}

// 雪花保存功能
function saveSnowflake() {
    const formatSelect = document.getElementById('kochChartFormat');
    const format = formatSelect ? formatSelect.value : 'png';
    const statusElement = document.getElementById('kochChartStatus');
    
    try {
        const svgElement = document.querySelector('#kochChart svg');
        if (!svgElement) {
            showStatus(statusElement, '❌ 没有找到雪花图形', 'error');
            return;
        }
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        
        if (format === 'svg') {
            // 直接下载SVG
            downloadFile(svgBlob, '科赫雪花_' + new Date().toISOString().slice(0, 10) + '.svg');
            showStatus(statusElement, '✅ SVG保存成功！', 'success');
        } else {
            // 将SVG转换为Canvas进行PNG/PDF导出
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            const svgUrl = URL.createObjectURL(svgBlob);
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                if (format === 'png') {
                    canvas.toBlob(function(blob) {
                        downloadFile(blob, '科赫雪花_' + new Date().toISOString().slice(0, 10) + '.png');
                        showStatus(statusElement, '✅ PNG保存成功！', 'success');
                    });
                } else if (format === 'pdf') {
                    // 简单的PDF导出（使用Canvas）
                    canvas.toBlob(function(blob) {
                        downloadFile(blob, '科赫雪花_' + new Date().toISOString().slice(0, 10) + '.pdf');
                        showStatus(statusElement, '✅ PDF保存成功！', 'success');
                    });
                }
                
                URL.revokeObjectURL(svgUrl);
            };
            
            img.src = svgUrl;
        }
    } catch (error) {
        showStatus(statusElement, '❌ 保存失败: ' + error.message, 'error');
    }
}

// 下载文件辅助函数
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 显示状态消息
function showStatus(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = 'status-message status-' + type;
    element.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// 图表保存功能
function saveChart(chartId, chartName) {
    const formatSelect = document.getElementById(chartId + 'Format');
    const format = formatSelect ? formatSelect.value : 'png';
    const statusElement = document.getElementById(chartId + 'Status');
    
    try {
        if (chartId === 'kochChart') {
            saveSnowflake();
            return;
        }
        
        // 使用Plotly的保存功能
        Plotly.downloadImage(chartId, {
            format: format,
            filename: chartName + '_' + new Date().toISOString().slice(0, 10),
            height: 800,
            width: 1200,
            scale: 2
        }).then(() => {
            showStatus(statusElement, '✅ 图表保存成功！', 'success');
        }).catch(error => {
            showStatus(statusElement, '❌ 保存失败: ' + error.message, 'error');
        });
    } catch (error) {
        showStatus(statusElement, '❌ 保存失败: ' + error.message, 'error');
    }
}

// 雪花保存功能
function saveSnowflake() {
    const formatSelect = document.getElementById('kochChartFormat');
    const format = formatSelect ? formatSelect.value : 'png';
    const statusElement = document.getElementById('kochChartStatus');
    
    try {
        const svgElement = document.querySelector('#kochChart svg');
        if (!svgElement) {
            showStatus(statusElement, '❌ 没有找到雪花图形', 'error');
            return;
        }
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        
        if (format === 'svg') {
            // 直接下载SVG
            downloadFile(svgBlob, '科赫雪花_' + new Date().toISOString().slice(0, 10) + '.svg');
            showStatus(statusElement, '✅ SVG保存成功！', 'success');
        } else {
            // 将SVG转换为Canvas进行PNG/PDF导出
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            const svgUrl = URL.createObjectURL(svgBlob);
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                if (format === 'png') {
                    canvas.toBlob(function(blob) {
                        downloadFile(blob, '科赫雪花_' + new Date().toISOString().slice(0, 10) + '.png');
                        showStatus(statusElement, '✅ PNG保存成功！', 'success');
                    });
                } else if (format === 'pdf') {
                    // 简单的PDF导出（使用Canvas）
                    canvas.toBlob(function(blob) {
                        downloadFile(blob, '科赫雪花_' + new Date().toISOString().slice(0, 10) + '.pdf');
                        showStatus(statusElement, '✅ PDF保存成功！', 'success');
                    });
                }
                
                URL.revokeObjectURL(svgUrl);
            };
            
            img.src = svgUrl;
        }
    } catch (error) {
        showStatus(statusElement, '❌ 保存失败: ' + error.message, 'error');
    }
}

// 下载文件辅助函数
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 显示状态消息
function showStatus(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = 'status-message status-' + type;
    element.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 初始化第一个标签页的图表
    updateBarChart();
});

// 响应窗口大小变化
window.addEventListener('resize', function() {
    // 重新绘制当前显示的图表
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const tabId = activeTab.id;
        initializeChart(tabId);
    }
});
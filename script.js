// 交互式数据可视化网页 - JavaScript功能实现

// 全局Plotly错误处理
function safePlotlyCall(chartId, data, layout, config) {
    if (typeof Plotly === 'undefined') {
        console.error('Plotly库未加载，无法绘制图表');
        
        // 显示错误信息
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; color: #666; font-size: 16px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                    <div style="text-align: center;">
                        <strong>图表库加载失败</strong><br>
                        <span style="font-size: 14px;">请检查网络连接后刷新页面</span>
                    </div>
                </div>
            `;
        }
        return false;
    }
    
    try {
        Plotly.newPlot(chartId, data, layout, config);
        return true;
    } catch (error) {
        console.error('Plotly绘图错误:', error);
        
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; color: #e74c3c; font-size: 16px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                    <div style="text-align: center;">
                        <strong>图表绘制失败</strong><br>
                        <span style="font-size: 14px;">${error.message}</span>
                    </div>
                </div>
            `;
        }
        return false;
    }
}

// 检查Plotly可用性的包装函数
function checkPlotlyAvailable() {
    if (typeof Plotly === 'undefined') {
        console.warn('Plotly库不可用');
        return false;
    }
    return true;
}

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
    const targetButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // 根据标签页初始化对应的图表
    initializeChart(tabId);
}

// 根据标签页初始化图表
function initializeChart(tabId) {
    switch(tabId) {
        case 'tab1':
            barData.initTable();
            updateBarChart();
            break;
        case 'tab2':
            lineData.initTable();
            updateLineChart();
            break;
        case 'tab3':
            tempData.initTable();
            updateTempChart();
            break;
        case 'tab4':
            updateKochSnowflake();
            break;
        case 'tab5':
            markerData.initTable();
            updateMarkerDemo();
            break;
    }
}

// 图书采购柱状图
function updateBarChart() {
    const region1Factor = document.getElementById('region1Slider').value / 100;
    const region2Factor = document.getElementById('region2Slider').value / 100;
    const barType = document.getElementById('barType').value;
    
    // 使用编辑区域的数据
    const bookTypes = barData.categories;
    const region1Data = barData.region1.map(val => val * region1Factor);
    const region2Data = barData.region2.map(val => val * region2Factor);
    
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
    
    // 使用编辑区域的数据
    const dates = lineData.dates;
    const rates2017 = lineData.rates2017;
    const rates2019 = lineData.rates2019;
    
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
    
    // 使用编辑区域的数据
    const days = tempData.days;
    const maxTemps = tempData.maxTemps;
    const minTemps = tempData.minTemps;
    
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
    d3.select('#kochChart').html('');
    
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
    svgContainer.append('path')
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
    
    // 使用编辑区域的数据
    const x = markerData.points.map(point => point.x);
    const y = markerData.points.map(point => point.y);
    const text = markerData.points.map(point => point.name);
    
    // 数据标记轨迹
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
        text: text,
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
        showlegend: false
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

// ==================== 数据编辑区域功能 ====================

// 图书采购数据存储
const barData = {
    categories: ['科普类', '文学类', '历史类', '数学类', '外语类'],
    region1: [120, 150, 90, 110, 130],
    region2: [100, 140, 110, 95, 120],
    
    // 初始化数据表
    initTable: function() {
        const tableBody = document.getElementById('barDataTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.categories.forEach((category, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${category}" onchange="barData.updateData(${index}, 'category', this.value)"></td>
                <td><input type="number" value="${this.region1[index]}" onchange="barData.updateData(${index}, 'region1', this.value)"></td>
                <td><input type="number" value="${this.region2[index]}" onchange="barData.updateData(${index}, 'region2', this.value)"></td>
                <td>
                    <button class="editor-btn danger" onclick="barData.deleteRow(${index})" style="padding: 5px 10px; font-size: 0.8em;">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新数据
    updateData: function(index, type, value) {
        if (type === 'category') {
            this.categories[index] = value;
        } else if (type === 'region1') {
            this.region1[index] = parseInt(value) || 0;
        } else if (type === 'region2') {
            this.region2[index] = parseInt(value) || 0;
        }
        
        this.applyChanges();
    },
    
    // 添加新行
    addRow: function() {
        this.categories.push('新类别');
        this.region1.push(100);
        this.region2.push(100);
        
        this.initTable();
        this.showStatus('✅ 新行添加成功！', 'success');
    },
    
    // 删除行
    deleteRow: function(index) {
        if (this.categories.length <= 1) {
            this.showStatus('❌ 至少保留一行数据！', 'error');
            return;
        }
        
        this.categories.splice(index, 1);
        this.region1.splice(index, 1);
        this.region2.splice(index, 1);
        
        this.initTable();
        this.showStatus('✅ 行删除成功！', 'success');
    },
    
    // 应用更改到主图表
    applyChanges: function() {
        updateBarChart();
        this.showStatus('✅ 更改已应用到图表！', 'success');
    },
    
    // 重置数据
    resetData: function() {
        this.categories = ['科普类', '文学类', '历史类', '数学类', '外语类'];
        this.region1 = [120, 150, 90, 110, 130];
        this.region2 = [100, 140, 110, 95, 120];
        
        this.initTable();
        this.showStatus('✅ 数据已重置！', 'success');
    },
    
    // 导出数据
    exportData: function(format) {
        try {
            let content, filename, mimeType;
            
            if (format === 'csv') {
                // 生成CSV内容
                const headers = ['图书类别', '地区1采购量', '地区2采购量'];
                const rows = this.categories.map((category, index) => 
                    [category, this.region1[index], this.region2[index]].join(',')
                );
                
                content = [headers.join(','), ...rows].join('\n');
                filename = '图书采购数据_' + new Date().toISOString().slice(0, 10) + '.csv';
                mimeType = 'text/csv';
                
            } else if (format === 'json') {
                // 生成JSON内容
                content = JSON.stringify({
                    categories: this.categories,
                    region1: this.region1,
                    region2: this.region2
                }, null, 2);
                filename = '图书采购数据_' + new Date().toISOString().slice(0, 10) + '.json';
                mimeType = 'application/json';
            }
            
            // 创建下载链接
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus(`✅ ${format.toUpperCase()}数据导出成功！`, 'success');
        } catch (error) {
            this.showStatus('❌ 导出失败: ' + error.message, 'error');
        }
    },
    
    // 显示状态消息
    showStatus: function(message, type) {
        const statusElement = document.getElementById('barDataStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'status-message status-' + type;
        statusElement.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
};

// 汇率数据存储
const lineData = {
    dates: ['7月1日', '7月5日', '7月10日', '7月15日', '7月20日', '7月25日', '7月31日'],
    rates2017: [6.78, 6.79, 6.77, 6.76, 6.75, 6.74, 6.73],
    rates2019: [6.87, 6.88, 6.86, 6.85, 6.84, 6.83, 6.82],
    
    // 初始化数据表
    initTable: function() {
        const tableBody = document.getElementById('lineDataTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.dates.forEach((date, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${date}" onchange="lineData.updateData(${index}, 'date', this.value)"></td>
                <td><input type="number" value="${this.rates2017[index]}" step="0.01" onchange="lineData.updateData(${index}, 'rates2017', this.value)"></td>
                <td><input type="number" value="${this.rates2019[index]}" step="0.01" onchange="lineData.updateData(${index}, 'rates2019', this.value)"></td>
                <td>
                    <button class="editor-btn danger" onclick="lineData.deleteRow(${index})" style="padding: 5px 10px; font-size: 0.8em;">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 更新数据
    updateData: function(index, type, value) {
        if (type === 'date') {
            this.dates[index] = value;
        } else if (type === 'rates2017') {
            this.rates2017[index] = parseFloat(value) || 0;
        } else if (type === 'rates2019') {
            this.rates2019[index] = parseFloat(value) || 0;
        }
        
        this.applyChanges();
    },
    
    // 添加新行
    addRow: function() {
        this.dates.push('新日期');
        this.rates2017.push(6.80);
        this.rates2019.push(6.90);
        
        this.initTable();
        this.showStatus('✅ 新行添加成功！', 'success');
    },
    
    // 删除行
    deleteRow: function(index) {
        if (this.dates.length <= 1) {
            this.showStatus('❌ 至少保留一行数据！', 'error');
            return;
        }
        
        this.dates.splice(index, 1);
        this.rates2017.splice(index, 1);
        this.rates2019.splice(index, 1);
        
        this.initTable();
        this.showStatus('✅ 行删除成功！', 'success');
    },
    
    // 应用更改到主图表
    applyChanges: function() {
        updateLineChart();
        this.showStatus('✅ 更改已应用到图表！', 'success');
    },
    
    // 重置数据
    resetData: function() {
        this.dates = ['7月1日', '7月5日', '7月10日', '7月15日', '7月20日', '7月25日', '7月31日'];
        this.rates2017 = [6.78, 6.79, 6.77, 6.76, 6.75, 6.74, 6.73];
        this.rates2019 = [6.87, 6.88, 6.86, 6.85, 6.84, 6.83, 6.82];
        
        this.initTable();
        this.showStatus('✅ 数据已重置！', 'success');
    },
    
    // 导出数据
    exportData: function(format) {
        try {
            let content, filename, mimeType;
            
            if (format === 'csv') {
                const headers = ['日期', '2017年汇率', '2019年汇率'];
                const rows = this.dates.map((date, index) => 
                    [date, this.rates2017[index], this.rates2019[index]].join(',')
                );
                
                content = [headers.join(','), ...rows].join('\n');
                filename = '汇率数据_' + new Date().toISOString().slice(0, 10) + '.csv';
                mimeType = 'text/csv';
                
            } else if (format === 'json') {
                content = JSON.stringify({
                    dates: this.dates,
                    rates2017: this.rates2017,
                    rates2019: this.rates2019
                }, null, 2);
                filename = '汇率数据_' + new Date().toISOString().slice(0, 10) + '.json';
                mimeType = 'application/json';
            }
            
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus(`✅ ${format.toUpperCase()}数据导出成功！`, 'success');
        } catch (error) {
            this.showStatus('❌ 导出失败: ' + error.message, 'error');
        }
    },
    
    // 显示状态消息
    showStatus: function(message, type) {
        const statusElement = document.getElementById('lineDataStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'status-message status-' + type;
        statusElement.style.display = 'block';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
};

// 温度数据存储
const tempData = {
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    maxTemps: [28, 30, 32, 29, 27, 25, 26],
    minTemps: [18, 20, 22, 19, 17, 15, 16],
    
    initTable: function() {
        const tableBody = document.getElementById('tempDataTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.days.forEach((day, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${day}" onchange="tempData.updateData(${index}, 'day', this.value)"></td>
                <td><input type="number" value="${this.maxTemps[index]}" onchange="tempData.updateData(${index}, 'maxTemp', this.value)"></td>
                <td><input type="number" value="${this.minTemps[index]}" onchange="tempData.updateData(${index}, 'minTemp', this.value)"></td>
                <td>
                    <button class="editor-btn danger" onclick="tempData.deleteRow(${index})" style="padding: 5px 10px; font-size: 0.8em;">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    updateData: function(index, type, value) {
        if (type === 'day') {
            this.days[index] = value;
        } else if (type === 'maxTemp') {
            this.maxTemps[index] = parseInt(value) || 0;
        } else if (type === 'minTemp') {
            this.minTemps[index] = parseInt(value) || 0;
        }
        
        this.applyChanges();
    },
    
    addRow: function() {
        this.days.push('新日期');
        this.maxTemps.push(25);
        this.minTemps.push(15);
        
        this.initTable();
        this.showStatus('✅ 新行添加成功！', 'success');
    },
    
    deleteRow: function(index) {
        if (this.days.length <= 1) {
            this.showStatus('❌ 至少保留一行数据！', 'error');
            return;
        }
        
        this.days.splice(index, 1);
        this.maxTemps.splice(index, 1);
        this.minTemps.splice(index, 1);
        
        this.initTable();
        this.showStatus('✅ 行删除成功！', 'success');
    },
    
    applyChanges: function() {
        updateTempChart();
        this.showStatus('✅ 更改已应用到图表！', 'success');
    },
    
    resetData: function() {
        this.days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        this.maxTemps = [28, 30, 32, 29, 27, 25, 26];
        this.minTemps = [18, 20, 22, 19, 17, 15, 16];
        
        this.initTable();
        this.showStatus('✅ 数据已重置！', 'success');
    },
    
    exportData: function(format) {
        try {
            let content, filename, mimeType;
            
            if (format === 'csv') {
                const headers = ['日期', '最高温度', '最低温度'];
                const rows = this.days.map((day, index) => 
                    [day, this.maxTemps[index], this.minTemps[index]].join(',')
                );
                
                content = [headers.join(','), ...rows].join('\n');
                filename = '温度数据_' + new Date().toISOString().slice(0, 10) + '.csv';
                mimeType = 'text/csv';
                
            } else if (format === 'json') {
                content = JSON.stringify({
                    days: this.days,
                    maxTemps: this.maxTemps,
                    minTemps: this.minTemps
                }, null, 2);
                filename = '温度数据_' + new Date().toISOString().slice(0, 10) + '.json';
                mimeType = 'application/json';
            }
            
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus(`✅ ${format.toUpperCase()}数据导出成功！`, 'success');
        } catch (error) {
            this.showStatus('❌ 导出失败: ' + error.message, 'error');
        }
    },
    
    showStatus: function(message, type) {
        const statusElement = document.getElementById('tempDataStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'status-message status-' + type;
        statusElement.style.display = 'block';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
};

// 标记数据存储
const markerData = {
    points: [
        { name: '点A', x: 1, y: 2 },
        { name: '点B', x: 2, y: 4 },
        { name: '点C', x: 3, y: 6 },
        { name: '点D', x: 4, y: 4 },
        { name: '点E', x: 5, y: 2 }
    ],
    
    initTable: function() {
        const tableBody = document.getElementById('markerDataTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.points.forEach((point, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${point.name}" onchange="markerData.updateData(${index}, 'name', this.value)"></td>
                <td><input type="number" value="${point.x}" step="0.1" onchange="markerData.updateData(${index}, 'x', this.value)"></td>
                <td><input type="number" value="${point.y}" step="0.1" onchange="markerData.updateData(${index}, 'y', this.value)"></td>
                <td>
                    <button class="editor-btn danger" onclick="markerData.deleteRow(${index})" style="padding: 5px 10px; font-size: 0.8em;">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    updateData: function(index, type, value) {
        if (type === 'name') {
            this.points[index].name = value;
        } else if (type === 'x') {
            this.points[index].x = parseFloat(value) || 0;
        } else if (type === 'y') {
            this.points[index].y = parseFloat(value) || 0;
        }
        
        this.applyChanges();
    },
    
    addRow: function() {
        this.points.push({ name: '新点', x: 3, y: 3 });
        this.initTable();
        this.showStatus('✅ 新点添加成功！', 'success');
    },
    
    deleteRow: function(index) {
        if (this.points.length <= 1) {
            this.showStatus('❌ 至少保留一个点！', 'error');
            return;
        }
        
        this.points.splice(index, 1);
        this.initTable();
        this.showStatus('✅ 点删除成功！', 'success');
    },
    
    applyChanges: function() {
        updateMarkerDemo();
        this.showStatus('✅ 更改已应用到图表！', 'success');
    },
    
    resetData: function() {
        this.points = [
            { name: '点A', x: 1, y: 2 },
            { name: '点B', x: 2, y: 4 },
            { name: '点C', x: 3, y: 6 },
            { name: '点D', x: 4, y: 4 },
            { name: '点E', x: 5, y: 2 }
        ];
        
        this.initTable();
        this.showStatus('✅ 数据已重置！', 'success');
    },
    
    exportData: function(format) {
        try {
            let content, filename, mimeType;
            
            if (format === 'csv') {
                const headers = ['点名称', 'X坐标', 'Y坐标'];
                const rows = this.points.map(point => 
                    [point.name, point.x, point.y].join(',')
                );
                
                content = [headers.join(','), ...rows].join('\n');
                filename = '标记数据_' + new Date().toISOString().slice(0, 10) + '.csv';
                mimeType = 'text/csv';
                
            } else if (format === 'json') {
                content = JSON.stringify({
                    points: this.points
                }, null, 2);
                filename = '标记数据_' + new Date().toISOString().slice(0, 10) + '.json';
                mimeType = 'application/json';
            }
            
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus(`✅ ${format.toUpperCase()}数据导出成功！`, 'success');
        } catch (error) {
            this.showStatus('❌ 导出失败: ' + error.message, 'error');
        }
    },
    
    showStatus: function(message, type) {
        const statusElement = document.getElementById('markerDataStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'status-message status-' + type;
        statusElement.style.display = 'block';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 初始化第一个标签页
    showTab('tab1');
});
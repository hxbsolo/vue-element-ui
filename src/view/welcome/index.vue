<template>
  <div id="welcome">
    <el-container>
      <el-row :gutter="12">
        <el-col
          :span="6"
          v-for="(item, index) in cardData"
          :key="item.icon"
          @click.native="changeL(index)"
        >
          <el-card shadow="hover" :style="{ color: item.color }" id="code">
            <div class="rowfs">
              <span :class="['iconfont', , item.icon]"></span>
            <div class="datas">
              <span>{{ item.title }}</span>
              <span>{{ item.data }}</span>
            </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 折线图 -->
      <div id="chartColumn" style="width: 100%; height: 400px"></div>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
      chartColumn: null,
      activeLine: 0,
      // 折线图数据
      lineData: [
        {
          title: "2020年访问量一览",
          legendData: ["真实访问量", "预估访问量"],
          xData: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          // 真实数据
          realData: [
            1500, 2800, 900, 1000, 800, 700, 1400, 1300, 900, 1000, 800, 600,
          ],
          // 推测数据
          guessData: [
            1200, 1400, 1800, 2500, 800, 700, 900, 1000, 800, 600, 2000, 2400,
          ],
          icon: "",
        },
        {
          title: "昨日访问量一览",
          legendData: ["真实访问量", "预估访问量"],
          xData: [
            "0:00",
            "02:00",
            "04:00",
            "06:00",
            "08:00",
            "10:00",
            "12:00",
            "14:00",
            "16:00",
            "18:00",
            "20:00",
            "22:00",
            "24:00",
          ],
          // 真实数据
          realData: [
            150, 280, 90, 100, 80, 70, 140, 130, 90, 100, 420, 60, 120,
          ],
          // 推测数据
          guessData: [
            120, 140, 180, 250, 80, 70, 90, 100, 80, 60, 200, 240, 140,
          ],
          icon: "",
        },
        {
          title: "2020年总成交量",
          legendData: ["真实成交量", "预估成交量"],
          xData: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          // 真实数据
          realData: [
            85418, 95123, 58203, 48415, 48502, 54312, 48561, 18432, 105210,
            91062, 104813, 84510,
          ],
          // 推测数据
          guessData: [
            75418, 85123, 68203, 68415, 38502, 64312, 41561, 11432, 85210,
            71062, 114813, 89510,
          ],
          // icon
          icon: "￥",
        },
        {
          title: "昨日成交量",
          legendData: ["真实成交量", "预估成交量"],
          xData: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          // 真实数据
          realData: [
            2418, 3023, 4823, 5815, 6502, 7312, 4525, 8432, 5010, 3106, 8510,
            6500,
          ],
          // 推测数据
          guessData: [
            1418, 2023, 3823, 6815, 7502, 6312, 4500, 5532, 6610, 4106, 8910,
            7483,
          ],
          // icon
          icon: "￥",
        },
      ],
      cardData: [
        {
          icon: "icon-showpassword",
          title: "总访问量",
          data: null,
          color: "#40C9C6",
        },
        {
          icon: "icon-user",
          title: "昨日访问量",
          data: null,
          color: "#36A3F7",
        },
        {
          icon: "icon-cart",
          title: "总成交量",
          data: "1025018￥",
          color: "#F4516C",
        },
        {
          icon: "icon-checkmark",
          title: "昨日成交量",
          data: "2253￥",
          color: "#34BFA3",
        },
      ],
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      this.chartColumn = echarts.init(document.getElementById("chartColumn"));
      let currentData = this.lineData[this.activeLine];
      this.chartColumn.setOption({
        title: {
          text: currentData.title,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: currentData.legendData,
        },
        grid: {
          top: "20%",
          left: "0%",
          right: "2%",
          bottom: "0%",
          // 把x轴和y轴纳入 grid
          containLabel: true,
        },
        toolbox: {
          trigger: "axis",
          // 十字交叉器
          axisPointer: {
            type: "cross",
          },
        },
        xAxis: {
          type: "category",
          // data: xDataArr,
          data: currentData.xData,
          // 紧挨边缘
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: currentData.legendData[0],
            smooth: true,
            type: "line",
            animationDuration: 2800,
            data: currentData.realData,
            animationEasing: "quadraticOut",
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
                formatter: "{c}" + currentData.icon,
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                },
                {
                  type: "min",
                  name: "最小值",
                },
              ],

              animationDuration: 2800,
              animationEasing: "quadraticOut",
            },
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
          },
          {
            name: currentData.legendData[1],
            smooth: true,
            type: "line",
            animationDuration: 2800,
            data: currentData.guessData,
            animationEasing: "cubicInOut",
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
                formatter: "{c}" + currentData.icon,
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                },
                {
                  type: "min",
                  name: "最小值",
                },
              ],
              animationDuration: 2800,
              animationEasing: "quadraticOut",
            },
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
          },
        ],
      });
    },
    changeL(i) {
      this.activeLine = i;
      this.chartColumn.dispose();
      this.drawLine();
    },
  },
};
</script>
<style scoped>
.is-vertical .el-container {
  flex-direction: column;
}
#welcome .el-row .el-col .datas {
  display: flex;
  flex-direction: column;
}
#welcome .el-row .el-card__body {
  line-height: 24px;
}
#welcome .el-row .el-card__body .iconfont {
  font-size: 48px;
}
#welcome .el-card {
  cursor: pointer;
}
#chartColumn {
  background: #fff;
  margin-top: 20px;
  border-radius: 10px;
  padding: 20px;
}
.rowfs{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
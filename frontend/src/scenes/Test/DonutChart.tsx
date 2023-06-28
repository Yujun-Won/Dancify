import React from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutControllerDatasetOptions,
  Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
// import { useAppSelector } from "@toolkit/hook";

export default function DonutChart() {
  // const { playIndex, sectionPracticeArr } = useAppSelector(
  //   (state) => state.practice
  // );

  // const poseMessages = sectionPracticeArr[playIndex]?.poseMessages;
  const poseMessages = {
    Miss: 6,
    Good: 45,
    Great: 23,
    Excellent: 4,
  };

  Chart.register(ArcElement, Tooltip, Legend);
  const dataValues = poseMessages && Object.values(poseMessages);

  const data = {
    labels: ["Miss", "Good", "Great", "Excellent"],
    datasets: [
      {
        labels: ["Miss", "Good", "Great", "Excellent"],
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const plugin: Plugin<"doughnut"> = {
    id: "centerText",
    beforeDraw: function (chart: Chart) {
      const { ctx } = chart;
      ctx.save();

      // scoreText 표시
      const scoreText = "84";
      const xCoor = chart.getDatasetMeta(0)?.data[0].x;
      const yCoor = chart.getDatasetMeta(0)?.data[0].y;
      const fontSize = (yCoor / 50).toFixed(2);
      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(scoreText, xCoor, yCoor * 0.95);

      // scoreText 의 높이 추출
      const metrics = ctx.measureText(scoreText);
      const actualHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      // scoreText 아래에 표시
      const subText = "Score";
      const subFontSize = (yCoor / 90).toFixed(2);
      ctx.font = `${subFontSize}rem sans-serif`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(subText, xCoor, yCoor * 0.95 + actualHeight);
    },
  };

  // 플러그인 리스트
  const plugins: Plugin<"doughnut", DoughnutControllerDatasetOptions>[] = [
    plugin,
  ];

  return (
    <>
      {dataValues && (
        <Doughnut data={data} options={options} plugins={plugins} />
      )}
    </>
  );
}

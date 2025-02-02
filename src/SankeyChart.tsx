
import { onMount } from 'solid-js';
import Chart from 'chart.js/auto';
import {SankeyController, Flow} from 'chartjs-chart-sankey';

Chart.register(SankeyController, Flow);

interface SankeyChartProps {
  stats: any;
}

const colors: Record<string, string> = {
  interactions: '#b5fef7',
  matches: '#f7bbe1',
  likesGiven: '#ffdda5',
  likesReceived: '#ffdda5',
  meetups: '#fb9191'
} as const;

const getHover = (key: string) => colors[key];
const getColor = (key: string) => colors[key];

function SankeyChart(props: SankeyChartProps) {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    // Create the Sankey diagram using data from props.stats.
    // Customize the data flow as needed based on your stats.
    const sankeyChart = new Chart(canvasRef!, {
      type: 'sankey',
      data: {
        datasets: [{
        label: 'My sankey',
        data: [
            {from: 'interactions', to: 'likesGiven', flow: props.stats.likesSent},
            {from: 'interactions', to: 'likesReceived', flow: props.stats.likesReceived},
            {from: 'likesGiven', to: 'matches', flow: props.stats.matchesFromLikesSent},
            {from: 'likesReceived', to: 'matches', flow: props.stats.matchesFromLikesReceived},
            {from: 'matches', to: 'meetups', flow: props.stats.meetups},
        ],
        colorFrom: (c: any) => getColor(c.dataset.data[c.dataIndex].from),
        colorTo: (c: any) => getColor(c.dataset.data[c.dataIndex].to),
        hoverColorFrom: (c: any) => getHover(c.dataset.data[c.dataIndex].from),
        hoverColorTo: (c: any) => getHover(c.dataset.data[c.dataIndex].to),
        colorMode: 'gradient',
        alpha: 0.5,
        labels: {
            interactions: 'interactions ' + props.stats.totalInteractions,
            likesGiven: 'likes given ' + props.stats.likesSent,
            likesReceived: 'likes received ' + props.stats.likesReceived,
            matches: 'matches ' + props.stats.matches,
            meetups: 'meetups ' + props.stats.meetups,
        },
        priority: {
            b: 1,
            d: 0
        },
        column: {
            interactions: 0,
            likesGiven: 1,
            likesReceived: 1,
            matches: 2,
            meetups: 3,
        },
        size: 'max', // or 'min' if flow overlap is preferred
        } as any]
      },
    });

    return () => {
      sankeyChart.destroy();
    };
  });

  return (
    <div class="w-full max-w-xl my-6">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default SankeyChart;

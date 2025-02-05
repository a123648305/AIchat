import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';
const Pie: React.FC = () => {
  const chatDom = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<echarts.ECharts | null>(null);

  const defaultOps = {
    title: {
      text: 'Stacked Line',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {},
    legend: {},
    series: [
      {
        name: 'price',
        type: 'line',
      },
      {
        name: 'capital',
        type: 'line',
      },
      {
        name: 'interest',
        type: 'line',
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const result = params[0].data;
        return `${params[0].marker}${result.date}<br/> 金额: ${result.price}<br/> 本金: ${result.capital}<br/> 利息: ${result.interest}`;
      },
    },
    dataset: [
      {
        dimensions: ['date', 'capital', 'interest', 'price', 'totalCapital', 'totalInterest', 'totalPrice'],
        source: [],
      },
    ],
  };

  const chartInit = () => {
    console.log(chatDom, 'x');
    const myChart = echarts.init(chatDom.current);
    myChart.setOption(defaultOps);
    chatInstance.current = myChart;
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    const { lrp, price, months } = values;
    const monthLrp = lrp / 12;
    const maxMonth = months * 12;
    const capital = (price / maxMonth).toFixed(2);

    let totalInterest = 0;
    let totalPrice = 0;

    const data = Array.from({ length: maxMonth })
      .fill(0)
      .map((_, index: number) => {
        const remainCapital = ((maxMonth - index) / maxMonth) * price;
        const interest = ((remainCapital * monthLrp) / 100).toFixed(2);
        const totalCapital = (((index + 1) / maxMonth) * price).toFixed(2);
        const curPrice = (parseFloat(capital) * 100 + parseFloat(interest) * 100) / 100;
        totalInterest += parseFloat(interest);
        totalPrice += curPrice;
        return {
          date: dayjs().add(index, 'month').format('YYYY-MM-DD'),
          capital,
          interest,
          price: curPrice,
          totalCapital,
          totalInterest: totalInterest.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
          remainPrice: (price - parseFloat(totalCapital)).toFixed(2),
          value:curPrice
        };
      });

    console.log(data, 'calcu');

    setDataSource(data);
    chatInstance?.current?.clear();
    chatInstance?.current?.setOption({
      ...defaultOps,
      dataset: [
        {
          //   dimensions: ['date', 'capital', 'interest', 'price', 'totalCapital', 'totalInterest', 'totalPrice'],
          source: data,
        },
      ],
    });
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '本金',
      dataIndex: 'capital',
      key: 'capital',
    },
    {
      title: '利息',
      dataIndex: 'interest',
      key: 'interest',
    },
    {
      title: '金额',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '累计本金',
      dataIndex: 'totalCapital',
      key: 'totalCapital',
    },
    {
      title: '累计利息',
      dataIndex: 'totalInterest',
      key: 'totalInterest',
    },
    {
      title: '累计金额',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: '剩余本金',
      dataIndex: 'remainPrice',
      key: 'remainPrice',
    },
  ];

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const monthOptions = Array.from({ length: 30 }).map((item, index) => {
    return {
      value: index + 1,
      label: `${index + 1}年`,
    };
  });

  useEffect(() => {
    chartInit();
  }, []);

  return (
    <div className="pie-wrapper">
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} onFinish={onFinish} autoComplete="off">
        <Form.Item label="金额" name="price">
          <Input />
        </Form.Item>
        <Form.Item label="LRP" name="lrp">
          <Input />
        </Form.Item>
        <Form.Item label="期数" name="months">
          <Select>
            {monthOptions.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            计算
          </Button>
        </Form.Item>
      </Form>
      <div style={{ height: 400 }} ref={chatDom}></div>
      <Table size="small" columns={columns} dataSource={dataSource} rowKey="date"></Table>
    </div>
  );
};

export default Pie;

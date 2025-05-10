import React from "react"
import { Radio, Space, Typography } from "antd"
import { WalletOutlined, BankOutlined, CreditCardOutlined } from "@ant-design/icons"

const { Text } = Typography

const PaymentMethod = ({ value, onChange }) => {
  const paymentMethods = [
    {
      value: "MOMO",
      label: "Ví MoMo",
      icon: <WalletOutlined />,
      description: "Thanh toán qua ví MoMo"
    },
    {
      value: "BANK",
      label: "Chuyển khoản ngân hàng",
      icon: <BankOutlined />,
      description: "Chuyển khoản qua PayOS"
    },
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng",
      icon: <CreditCardOutlined />,
      description: "Thanh toán tiền mặt khi nhận hàng"
    }
  ]

  return (
    <Radio.Group value={value} onChange={onChange}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {paymentMethods.map(method => (
          <Radio key={method.value} value={method.value}>
            <Space>
              {method.icon}
              <div>
                <Text strong>{method.label}</Text>
                <br />
                <Text type="secondary">{method.description}</Text>
              </div>
            </Space>
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  )
}

export default PaymentMethod
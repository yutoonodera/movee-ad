import React from "react";
import { Card } from "antd";

type Props = {
  url: string;
};

export default function OGPCard({ url }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Card
        hoverable
        style={{ maxWidth: 300, marginBottom: "20px" }}
      >
        <Card.Meta title={url} />
      </Card>
    </a>
  );
}

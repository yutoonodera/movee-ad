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
        // cover={
        //   <img
        //     alt="OGP Image"
        //     src={`https://api.opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=e3d9561c-ed10-4230-81ad-5a2539ea233c`}
        //     onError={(e) => {
        //       // Fallback image in case OGP image is not available
        //       (e.target as HTMLImageElement).src = "/placeholder-image.png";
        //     }}
        //   />
        // }
      >
        <Card.Meta title={url} />
      </Card>
    </a>
  );
}

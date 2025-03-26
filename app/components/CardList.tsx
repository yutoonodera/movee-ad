import React from "react";
import { Card } from "antd";
import { CoffeeOutlined, HomeOutlined } from "@ant-design/icons"; // アイコンをインポート
import { OPEN_GRAPH_IMAGE } from "../constants";

interface CardListProps {
  notionData: { title: string; updateUser: string, lastEditBy: String, icon: string, link: string; isActive: boolean }[];
  onCardClick: (link: string) => void; // 追加
}

const CardList: React.FC<CardListProps> = ({ notionData, onCardClick }) => {
    return (
      <div className="grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3 lg:text-left gap-4">
        {notionData.map((item, index) => (
          <Card
            key={index}
            title={<span className="block text-sm whitespace-normal overflow-hidden text-ellipsis">{item.title}</span>}
            hoverable
            className={`border flex flex-col items-center ${
              item.isActive ? "bg-yellow-200 border-yellow-400" : "border-gray-300 dark:border-neutral-700"
            }`}
            style={{ width: "100%" }}
            onClick={() => onCardClick(item.link)} // クリック時に遷移
          >
          <div className="flex justify-center items-center h-10">
            {/* アイコンがURLなら、画像として表示 */}
            {item.icon ? (
              <img src={item.icon} alt="Card Icon" style={{ width: "48px", height: "48px", objectFit: "cover" }} />
            ) : (
                <img src={OPEN_GRAPH_IMAGE} alt="Card Icon" style={{ width: "48px", height: "48px", objectFit: "cover" }} />
            )}
          </div>
            <div className="flex justify-center items-center">{item.updateUser}</div>
            <div className="flex justify-center items-center">{item.lastEditBy}</div>
          </Card>
        ))}
      </div>
    );
  };


export default CardList;

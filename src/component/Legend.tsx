import React from "react";

const legendItems = [
  { label: "ROUGH", color: "red" },
  { label: "IDLE", color: "steelblue" },
  { label: "SMOOTH", color: "green" },
  { label: "SPRINT", color: "blue" },
  { label: "MEDIUM", color: "orange" },
];

export default function Legend() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {legendItems.map((item) => (
        <div
          key={item.label}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: item.color,
            }}
          ></div>
          <span className="text-white">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

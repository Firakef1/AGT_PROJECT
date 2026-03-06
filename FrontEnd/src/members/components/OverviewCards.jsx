import React from "react";

/**
 * OverviewCards
 *
 * Renders a responsive grid of summary stat cards.
 *
 * Props:
 *   cards {Array} – array of card objects with shape:
 *     {
 *       title      {string}   – card label
 *       value      {string}   – main numeric/text value
 *       change     {string}   – change indicator text (e.g. "+5%")
 *       changeType {string}   – "positive" | "neutral" | "negative"
 *       icon       {Component} – lucide-react icon component
 *       iconBg     {string}   – icon background colour
 *       iconColor  {string}   – icon foreground colour
 *       onClick    {function} – optional click handler
 *     }
 */
const OverviewCards = ({ cards = [] }) => {
  return (
    <div className="overview-cards-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="overview-stat-card"
            onClick={card.onClick}
            role={card.onClick ? "button" : undefined}
            tabIndex={card.onClick ? 0 : undefined}
            onKeyDown={
              card.onClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      card.onClick();
                    }
                  }
                : undefined
            }
            title={card.onClick ? `Go to ${card.title}` : undefined}
            style={{ cursor: card.onClick ? "pointer" : "default" }}
          >
            {/* Top row: icon bubble + change badge */}
            <div className="overview-stat-card-top">
              <div
                className="overview-stat-icon"
                style={{ background: card.iconBg }}
              >
                {Icon && <Icon size={20} color={card.iconColor} />}
              </div>

              {card.change && (
                <span
                  className={`overview-stat-change ${card.changeType ?? "neutral"}`}
                >
                  {card.change}
                </span>
              )}
            </div>

            {/* Label */}
            <p className="overview-stat-label">{card.title}</p>

            {/* Value */}
            <h2 className="overview-stat-value">{card.value}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;

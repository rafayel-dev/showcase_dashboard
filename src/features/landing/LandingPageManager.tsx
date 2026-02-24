import React, { useState } from "react";
import { Tabs } from "antd";
import PageHeader from "../../components/common/PageHeader";
import LandingOrders from "./components/LandingOrders";
import LandingProducts from "./components/LandingProducts";
import LandingForm from "./components/LandingForm";
import "./components/tab.css";

const LandingPageManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("1");

    const items = [
        {
            key: "1",
            label: "Order List",
            children: <LandingOrders />,
        },
        {
            key: "2",
            label: "Product List",
            children: <LandingProducts />,
        },
        {
            key: "3",
            label: "Update / Add Product",
            children: <LandingForm />,
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <PageHeader
                title="Landing Page Manager"
                subtitle="Manage your storefront landing page content"
            />

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Tabs
                    animated
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    type="card"
                    className="landing-tabs"
                    tabBarStyle={{ fontWeight: "bold", color: "#8b5cf6" }}
                />
            </div>
        </div>
    );
};

export default LandingPageManager;

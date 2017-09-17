import * as React from "react";
import Header from "components/header";
import HomeView from "views/home";

export default class HomeEntry extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Header />
                <main className="app-content">
                    <HomeView />
                </main>
            </div>
        );
    }
}

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./controllers/main.ts" />


module main {
    import MyController = ControllerMain.RSSController;

    export function Run() {
        var Main = new MyController();
    }
}

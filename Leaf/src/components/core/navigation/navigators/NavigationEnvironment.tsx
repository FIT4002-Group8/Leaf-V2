import UUID from "../../../../model/core/UUID";
import StateManager from "../../../../state/publishers/StateManager";
import LeafScreen from "../LeafScreen";
import NavigationStateManager from "./NavigationStateManager";


class NavigationEnvironment {

    public static readonly inst = new NavigationEnvironment()

    private _sidebarComponent: JSX.Element | undefined = undefined;
    public get sidebarComponent(): JSX.Element | undefined {
        return this._sidebarComponent;
    }

    private _sidebarHeader: string | undefined = undefined;
    public get sidebarHeader(): string | undefined {
        return this._sidebarHeader
    }

    private _screens: LeafScreen[] = [];
    public get screens(): LeafScreen[] {
        return this._screens;
    }

    public loadedNavigation = () => {}

    private constructor() { }

    public prepareForNavigation() {
        StateManager.headerTitleOverride.publish(null);
    }

    public setSidebarComponent(component: JSX.Element, header: string) {
        this._sidebarComponent = component;
        this._sidebarHeader = header;
        StateManager.headerTitleOverride.publish(null);
        NavigationStateManager.sidebarComponentChanged.publish();
        NavigationStateManager.headerShouldUpdate.publish();
    }

    public clearScreens() {
        this._screens = [];
        NavigationStateManager.newScreenAdded.publish();
    }

    public navigationTo(component: React.FC, navigation: any, title: string) {
        if (navigation == undefined) {
            this._screens = [];
        }
        let id = UUID.generate().toString()
        this._screens.push(
            new LeafScreen(
                title,
                id,
                component,
                {},
            )
        )
        this.loadedNavigation = () => {
            if (this._screens.length > 1 && navigation != undefined) {
                navigation.navigate(id);
            }
        }
        NavigationStateManager.newScreenAdded.publish();
    }

}

export default NavigationEnvironment;
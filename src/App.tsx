import {Component, Vue} from "vue-facing-decorator";
import Page from "@/components/page/Page";

@Component
export default class App extends Vue{

    render() {
        return <>
            <Page />
        </>
    }
}
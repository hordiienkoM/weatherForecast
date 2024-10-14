import {Component, TSX, Vue} from "vue-facing-decorator";
import styles from "./header.module.scss";

@Component
export default class Header extends TSX()(Vue) {

    render() {
        return <>
            <div class={styles.header}>
                <div class={styles.logo} />
            </div>
        </>
    }
}
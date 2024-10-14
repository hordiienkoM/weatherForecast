import {Component, Emit, TSX, Vue} from "vue-facing-decorator";
import styles from "./closeBtn.module.scss"

interface Props {

}

interface Emits {
    click: void
}

@Component
export default class CloseBtn extends TSX<Props, Emits>()(Vue) {

    @Emit('click')
    private click() {}

    render() {
        return <>
            <button class={styles.closeBtn} onClick={this.click} />
        </>
    }
}
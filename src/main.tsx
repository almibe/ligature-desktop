import { render } from 'solid-js/web'
import { LigatureEditor } from '@ligature/ligature-components'
import '../node_modules/@ligature/ligature-components/dist/style.css'

render(() =>
  <>
    <LigatureEditor></LigatureEditor>   
  </>,
  document.getElementById('root') as HTMLElement
)

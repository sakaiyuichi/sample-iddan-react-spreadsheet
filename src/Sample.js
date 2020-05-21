import React, { useState } from 'react'

// material-ui
import { 
    Button,
    Select,
    MenuItem
} from '@material-ui/core/'

// React Spreadsheet
import Spreadsheet from 'react-spreadsheet'
import './Sample.css'

// 選択肢
const selectItems = [
    {id: 10, name: '産地〆マダイ養殖', tanka: 100},
    {id: 20, name: 'アトランティクサーモン養殖', tanka: 200},
    {id: 30, name: '活アサリ', tanka: 300},
    {id: 40, name: 'カンパチフィレ', tanka: 400},
]

// カスタムセルの設定（表示用）
// 表示用は disabled 状態にしておくこと
const SelectView = ({ cell, getValue }) => (
    <Select disabled variant="outlined" value={getValue({ data: cell })}>
        {selectItems.map(item => (
            <MenuItem value={item.id}>{item.name}</MenuItem>
        ))}
    </Select>
)

// カスタムセルの設定（編集用）
// onChange を書いて value を更新する
const SelectEdit = ({ getValue, cell, onChange }) => (
    <Select autoFocus variant="outlined" value={getValue({ data: cell })}
        onChange={e => {onChange({ ...cell, value: e.target.value })}}>
        {selectItems.map(item => (
            <MenuItem value={item.id}>{item.name}</MenuItem>
        ))}
    </Select>
)

// スプレッドのデータ
// カスタムセルを用いる部分には DataViewer、DataEditor を指定する
const initData = [
    [
        {value: 10, oldValue: 10, DataViewer: SelectView, DataEditor: SelectEdit, name: 'item', row: 1, },
        {value: 103, className: 'myNumber'},
        {value: '', className: 'myNumber'}
    ],
    [
        {value: 20, oldValue: 20, DataViewer: SelectView, DataEditor: SelectEdit, name: 'item', row: 2, },
        {value: 200, className: 'myNumber'},
        {value: '', className: 'myNumber'}
    ],
    [
        {value: 30, oldValue: 30, DataViewer: SelectView, DataEditor: SelectEdit},
        {value: 300, className: 'myNumber'},
        {value: '', className: 'myNumber'}
    ],
    [
        {value: 40, oldValue: 40, DataViewer: SelectView, DataEditor: SelectEdit},
        {value: 400, className: 'myNumber'},
        {value: '', className: 'myNumber'}
    ],
]

// 列タイトル
const colLabels = ['商品', '単価', '数量']

const Sample = () => {

    // ステートフック
    const [details, setDetails] = useState(initData)

    const [commitValues, setCommitValues] = useState({
        prevCell: {}, 
        nextCell: {}, 
        coords: {}, 
    })

    // セルの変更時
    // 文字単位で変更時に呼ばれる
    // data : 変更後のスプレッド全体の配列
    const onChange = (data) => {
        data.map(dat => {
            if (dat[0].value !== dat[0].oldValue) {
                dat[1].value = selectItems.filter(item => item.id === dat[0].value)[0].tanka
                dat[0].oldValue = dat[0].value
            }
        })
        setDetails(data)
    }

    // セルのコミット後
    // セルの変更が完了した時に呼ばれる
    // （文字単位の変更では呼ばれない）
    // prevVal : 変更前の値
    // nextVal : 変更後の値
    // coords : 移動先セルのX,Y位置（※変更されたセルではないので注意！）
    const onCellCommit = (prevVal, nextVal, coords) => {
        setCommitValues({
            prevCell: prevVal, 
            nextCell: nextVal, 
            coords, 
        })
        // console.log(prevVal)
        // console.log(nextVal)
        // console.log(coords)
    }

    // 値の表示
    const doShowValue = () => {
        alert(JSON.stringify(details))
    }

    return (
        <div>
            <Spreadsheet
                data={details}
                columnLabels={colLabels}
                hideRowIndicators='true'
                onChange={onChange}
                onCellCommit={onCellCommit}
            />
            <br />
            <Button variant="contained" color="primary" onClick={() => doShowValue()}>値の表示</Button>

            <pre>
                {JSON.stringify(commitValues, null, 2)}
            </pre>
        </div>
    )
}

export default Sample
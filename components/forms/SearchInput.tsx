'use client'

import { useState } from "react"

interface Props {
    search: Function,
}
function SearchInput({ search }: Props) {
    const [text, setText] = useState<string>('')
    return (
        <div className="w-full">
            <input value={text} onChange={(e) => { setText(e.target.value); search(e.target.value) }} className="searchInput no-focus" placeholder="Search" />
        </div>
    )
}

export default SearchInput
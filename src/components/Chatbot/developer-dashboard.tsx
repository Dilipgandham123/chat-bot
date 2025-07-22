"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { BarChart3, Table2, Filter, PieChart as PieIcon, LineChart as LineIcon } from "lucide-react"
import { getPRDataService } from "@/app/Services/service"
import { useSharedContext } from "@/lib/shared-context"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { PRData } from "@/lib/interface"
import { DataTable } from "./data-table"

const agent = ({
  url: 'http://192.168.0.156:8001 /csv/convert?file_name=oct_2024.csv',
})

const tableColumns = [
  { accessorKey: "index", header: "ID" },
  { accessorKey: "brandName", header: "Brand Name" },
  { accessorKey: "productSize", header: "Product Size" },
  { accessorKey: "unitPerCase", header: "Units per Case" },
  { accessorKey: "sold_cases", header: "Sold Cases" },
  { accessorKey: "sold_total_bottles", header: "Total Bottles Sold" },
]

const chartColors = [
  "rgb(134 239 172)", "rgb(216 180 254)", "rgb(253 224 71)", "rgb(147 197 253)",
  "rgb(252 165 165)", "rgb(96 165 250)", "rgb(187 247 208)"
]

export function DeveloperDashboard() {
  const { prData , setPrData } = useSharedContext()
  const [filteredData, setFilteredData] = useState<PRData[]>([])
  const [filterParams, setFilterParams] = useState<{ status: string, author: string }>({ status: "a", author: "b" })
    const [messages, setMessages] = useState<[]>([])
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("pie")
  const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const setup = async () => {
    try {
      const res = await fetch(
        `http://192.168.0.156:8001/csv/convert?file_name=mar_2025.csv`
      )
      const text = await res.text()
      setMessages([text])
    } catch (error) {
      console.error('Chat fetch error:', error)
    }
  }

  setup()
}, [])


  useEffect(() => {
    getPRData()
  }, [])

  async function getPRData() {
    try {
      // const res = await getPRDataService()
      // // setPrData(res)
      setFilteredData(prData?.filter((pr: PRData) => pr.status !== 'running'))
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  function getStatusDataForPieChart() {
    const statusMap: { [key: string]: number } = {}
    filteredData.forEach(item => {
      const status = item.status
      if (!statusMap[status]) statusMap[status] = 0
      statusMap[status]++
    })
    return Object.entries(statusMap).map(([name, value], i) => ({
      name,
      value,
      color: chartColors[i % chartColors.length]
    }))
  }

  function getAuthorDataForBarChart() {
    const authorMap: { [key: string]: number } = {}
    filteredData.forEach(item => {
      const author = item.author
      if (!authorMap[author]) authorMap[author] = 0
      authorMap[author]++
    })
    return Object.entries(authorMap).map(([name, value], i) => ({
      name,
      value,
      color: chartColors[i % chartColors.length]
    }))
  }

  function getLineChartData() {
    const authorGroups: { [key: string]: { [date: string]: number } } = {}
    filteredData.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit' })
      const author = item.author
      if (!authorGroups[author]) authorGroups[author] = {}
      authorGroups[author][date] = (authorGroups[author][date] || 0) + 1
    })

    const dates = Array.from(new Set(filteredData.map(item => new Date(item.createdAt).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit' })))).sort()

    return dates.map(date => {
      const entry: any = { name: date }
      Object.keys(authorGroups).forEach(author => {
        entry[author] = authorGroups[author][date] || 0
      })
      return entry
    })
  }

  function renderChart() {
    if (chartType === "pie") {
      const pieData = getStatusDataForPieChart()
      return (
        <div>chart</div>
        // <ResponsiveContainer width="100%" height={300}>
        //   <PieChart>
        //     <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
        //       {pieData.map((entry, index) => (
        //         <Cell key={`cell-${index}`} fill={entry.color} />
        //       ))}
        //     </Pie>
        //     <Tooltip />
        //   </PieChart>
        // </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      const barData = getAuthorDataForBarChart()
      return (
        <div>chart</div>
        // <ResponsiveContainer width="100%" height={300}>
        //   <BarChart data={barData}>
        //     <XAxis dataKey="name" />
        //     <YAxis />
        //     <Tooltip />
        //     <Bar dataKey="value">
        //       {barData.map((entry, index) => (
        //         <Cell key={`cell-${index}`} fill={entry.color} />
        //       ))}
        //     </Bar>
        //   </BarChart>
        // </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      const data = getLineChartData()
      const authors = Object.keys(data[0] || {}).filter(key => key !== "name")
      return (
        <div>chart</div>
        // <ResponsiveContainer width="100%" height={300}>
        //   <LineChart data={data}>
        //     <XAxis dataKey="name" />
        //     <YAxis />
        //     <Tooltip />
        //     <Legend />
        //     {authors.map((author, index) => (
        //       <Line key={author} type="monotone" dataKey={author} stroke={chartColors[index % chartColors.length]} />
        //     ))}
        //   </LineChart>
        // </ResponsiveContainer>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Performance</CardTitle>
          <CardDescription>Monitor build times and test coverage across repositories</CardDescription>
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <Select value={filterParams.status} onValueChange={(e : any) => setFilterParams({ ...filterParams, status: e })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">All Statuses</SelectItem>
                <SelectItem value="approved">approved</SelectItem>
                <SelectItem value="needs revision">needs revision</SelectItem>
                <SelectItem value="merged">merged</SelectItem>
                <SelectItem value="in review">in review</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterParams.author} onValueChange={(e : any) => setFilterParams({ ...filterParams, author: e })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="b">All Authors</SelectItem>
                <SelectItem value="Jon.snow@got.com">Jon.snow@got.com</SelectItem>
                <SelectItem value="robert.baratheon@got.com">robert.baratheon@got.com</SelectItem>
                <SelectItem value="ned.stark@got.com">ned.stark@got.com</SelectItem>
                <SelectItem value="cersei.lannister@got.com">cersei.lannister@got.com</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => {
              let result = prData.filter((pr: PRData) => pr.status !== 'running')
              if (filterParams.status !== "a") {
                result = result.filter(pr => pr.status.toLowerCase().replace("_", " ") === filterParams.status.toLowerCase())
              }
              if (filterParams.author !== "b") {
                result = result.filter(pr => pr.author.toLowerCase() === filterParams.author.toLowerCase())
              }
              setFilteredData(result)
            }} variant="ghost" size="sm">Apply Filters</Button>
            <Button onClick={() => {
              setFilterParams({ status: "a", author: "b" })
              setFilteredData(prData.filter((pr: PRData) => pr.status !== 'running'))
            }} variant="ghost" size="sm">Clear Filters</Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={tableColumns} data={filteredData} />
          {/* {viewMode === "table" ? (
            <DataTable columns={tableColumns} data={filteredData} />
          ) : (
            renderChart()
          )} */}
        </CardContent>
      </Card>
{messages.map((msg, index) => (
  <div
    key={index}
    className="overflow-x-auto p-4 border rounded bg-white [&_table]:w-full [&_table]:border [&_table]:border-gray-300 
               [&_th]:bg-gray-100 [&_th]:font-semibold [&_th]:text-left [&_th]:p-2 [&_td]:p-2 [&_td]:border-t [&_tr]:border-b"
    dangerouslySetInnerHTML={{ __html: msg }}
  />
))}

  {/* <ReactMarkdown
                children={msg}
                remarkPlugins={[remarkGfm, remarkHtml]}  // Plugin for GitHub-flavored Markdown and HTML conversion
              /> */}

    </div>
  )
}

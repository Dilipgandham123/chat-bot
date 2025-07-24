"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import {
  BarChart3,
  Table2,
  Filter,
  PieChart as PieIcon,
  LineChart as LineIcon,
} from "lucide-react";
import { useSharedContext } from "@/lib/shared-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { ExciseData } from "@/lib/interface";
import { DynamicTable } from "./DynamicTable";

export function DeveloperDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "excise_duty_value",
    "wholesale_trade_margin",
    "district_name",
    "basic_price",
    "brand_type",
    "sold_cases",
  ]);

  const fetchData = async (page = 1) => {
    const res = await axios.get(
      `http://192.168.0.156:8002/api/liquorsales/?page=${page}`
    );
    setData(res.data.results);
    setCount(res.data.count);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Performance</CardTitle>
          <CardDescription>
            Monitor build times and test coverage across repositories
          </CardDescription>
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            {/* <div className="flex items-center gap-2">
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
            </Select> */}
            {/* <Button onClick={() => {
              let result = prData.filter((pr: ExciseData) => pr.status !== 'running')
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
            }} variant="ghost" size="sm">Clear Filters</Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <DynamicTable
            data={data}
            selectedColumns={selectedColumns}
            onPageChange={setCurrentPage}
            count={count}
            currentPage={currentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
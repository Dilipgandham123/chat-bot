import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  data: any[];
  selectedColumns: string[];
  onPageChange: (page: number) => void;
  count: number;
  currentPage: number;
}

const toTitleCase = (str: string) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const DynamicTable = ({
  data,
  selectedColumns,
  onPageChange,
  count,
  currentPage,
}: Props) => {
  const totalPages = Math.ceil(count / 20);

  return (
    <div className="space-y-4">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {selectedColumns.map((col) => (
              <TableHead key={col}>{toTitleCase(col)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {selectedColumns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
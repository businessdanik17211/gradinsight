import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  exportFacultyStats,
  exportCityStats,
  exportYearlyTrends,
  exportVacancyData,
  exportGraduatesData,
  exportFullReport,
  ExportFormat
} from '@/lib/export/dataExport';
import { toast } from 'sonner';

interface ExportButtonProps {
  type?: 'faculty' | 'city' | 'trends' | 'vacancies' | 'graduates' | 'full';
  className?: string;
}

export function ExportButton({ type = 'full', className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat, exportType: string) => {
    setIsExporting(true);
    try {
      switch (exportType) {
        case 'faculty':
          exportFacultyStats(format);
          break;
        case 'city':
          exportCityStats(format);
          break;
        case 'trends':
          exportYearlyTrends(format);
          break;
        case 'vacancies':
          exportVacancyData(format);
          break;
        case 'graduates':
          exportGraduatesData(1000, format);
          break;
        case 'full':
          exportFullReport(format);
          break;
      }
      toast.success(`Данные экспортированы в ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Ошибка при экспорте данных');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (type !== 'full') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Экспорт
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('xlsx', type)}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv', type)}>
            <FileText className="w-4 h-4 mr-2" />
            CSV (.csv)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Экспорт данных
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Полный отчёт</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('xlsx', 'full')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Полный отчёт (Excel)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv', 'full')}>
          <FileText className="w-4 h-4 mr-2" />
          Полный отчёт (CSV)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>По разделам (Excel)</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => handleExport('xlsx', 'faculty')}>
          Статистика по факультетам
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx', 'city')}>
          Статистика по городам
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx', 'trends')}>
          Тренды по годам
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx', 'vacancies')}>
          Данные о вакансиях
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx', 'graduates')}>
          Данные выпускников (1000)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

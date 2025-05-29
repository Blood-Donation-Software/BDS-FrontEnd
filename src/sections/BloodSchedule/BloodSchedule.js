'use client';

import { useState } from 'react';
import { DateRange } from 'react-date-range';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi'; // For Vietnamese support
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

export default function BloodSchedule() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const formattedDate = `${format(range[0].startDate, 'dd/MM/yyyy')} - ${format(
    range[0].endDate,
    'dd/MM/yyyy'
  )}`;

  return (
    <div className='w-screen'>
        <div className='w-[50%]'>
            <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="flex items-center gap-2">
                <CalendarIcon className="text-muted-foreground" />
                <Input
                    readOnly
                    value={formattedDate}
                    onClick={() => setOpen(true)}
                    className="cursor-pointer"
                />
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 z-50" align="start">
                <DateRange
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2}
                direction="horizontal"
                locale={vi}
                rangeColors={['#2563eb']} // Customize selected range color (Tailwind blue-600)
                />
            </PopoverContent>
            </Popover>
        </div>
    </div>
  );
}

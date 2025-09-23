
import React, { useState } from 'react';
import { Check, Trash2, ChevronDown, Plus, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: number;
  task: string;
  culture: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
}

const initialTasks: Task[] = [
  { id: 1, task: 'Sugar cane fertilization', culture: 'Sugar Cane', date: '2023-09-25', priority: 'High' },
  { id: 2, task: 'Cercospora treatment', culture: 'Banana', date: '2023-09-28', priority: 'Medium' },
  { id: 3, task: 'Pineapple growth inspection', culture: 'Pineapple', date: '2023-09-30', priority: 'Low' },
  { id: 4, task: 'Madère plot weeding', culture: 'Madère', date: '2023-10-05', priority: 'Medium' },
  { id: 5, task: 'Sugar cane cutting preparation', culture: 'Sugar Cane', date: '2024-01-10', priority: 'High' },
];

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    task: '',
    culture: '',
    date: '',
    priority: 'Medium'
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskComplete = (id: number) => {
    console.log('Task marked as completed');
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTaskDelete = (id: number) => {
    console.log('Task deleted successfully');
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handlePriorityChange = (id: number, priority: Task['priority']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
    console.log(`Priority changed to "${priority}"`);
  };

  const handleAddTask = () => {
    if (!newTask.task || !newTask.culture || !newTask.date) {
      console.error('Please fill in all required fields');
      return;
    }

    const taskToAdd: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      task: newTask.task,
      culture: newTask.culture,
      date: newTask.date,
      priority: newTask.priority as Task['priority'] || 'Medium'
    };

    setTasks([...tasks, taskToAdd]);
    setNewTask({
      task: '',
      culture: '',
      date: '',
      priority: 'Medium'
    });
    setShowAddTask(false);
    console.log('New task added successfully');
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-agri-primary" />
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
        </div>
        <Button 
          onClick={() => setShowAddTask(!showAddTask)}
          className="bg-green-500 hover:bg-green-600 text-white transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {showAddTask && (
        <div className="p-4 bg-muted/20 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Task</label>
              <input
                type="text"
                value={newTask.task}
                onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-agri-primary focus:border-agri-primary"
                placeholder="Task description"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Crop</label>
              <select
                value={newTask.culture}
                onChange={(e) => setNewTask({...newTask, culture: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-agri-primary focus:border-agri-primary"
              >
                <option value="">Select a crop</option>
                <option value="Sugar Cane">Sugar Cane</option>
                <option value="Banana">Banana</option>
                <option value="Pineapple">Pineapple</option>
                <option value="Madère">Madère</option>
                <option value="Yam">Yam</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-agri-primary focus:border-agri-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-agri-primary focus:border-agri-primary"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => setShowAddTask(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">TASK</TableHead>
              <TableHead className="w-[20%]">CROP</TableHead>
              <TableHead className="w-[15%]">DATE</TableHead>
              <TableHead className="w-[15%]">PRIORITY</TableHead>
              <TableHead className="w-[10%]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{task.task}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1.5 text-agri-primary" />
                    {task.culture}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(task.date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge className={`cursor-pointer ${getPriorityStyle(task.priority)}`}>
                        {task.priority} <ChevronDown className="ml-1 h-3 w-3 inline" />
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'High')}>
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Medium')}>
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Low')}>
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleTaskComplete(task.id)}
                      className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                      title="Mark as completed"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTaskDelete(task.id)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No tasks to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskList;

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { serviceSchema } from '@/lib/validations';
import { IServiceData } from '@/types/service';
import { availableIcons, getIconComponent } from '@/lib/iconMap';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceFormProps {
  initialData?: IServiceData | null;
  onSubmit: (data: z.infer<typeof serviceSchema>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function ServiceForm({ initialData, onSubmit, isLoading, onCancel }: ServiceFormProps) {
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      shortDesc: initialData.shortDesc || '',
      description: initialData.description,
      features: (initialData.features && initialData.features.length > 0) ? initialData.features : [''],
      pricing: initialData.pricing || '',
      color: (initialData.color as any) || 'blue',
      icon: initialData.icon,
      order: initialData.order ?? 0,
      active: initialData.active ?? true,
    } : {
      title: '',
      shortDesc: '',
      description: '',
      features: [''],
      pricing: '',
      color: 'blue',
      icon: 'Code',
      order: 0,
      active: true,
    },
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        shortDesc: initialData.shortDesc || '',
        description: initialData.description,
        features: (initialData.features && initialData.features.length > 0) ? initialData.features : [''],
        pricing: initialData.pricing || '',
        color: (initialData.color as any) || 'blue',
        icon: initialData.icon,
        order: initialData.order ?? 0,
        active: initialData.active ?? true,
      });
    } else {
      form.reset({
        title: '',
        shortDesc: '',
        description: '',
        features: [''],
        pricing: '',
        color: 'blue',
        icon: 'Code',
        order: 0,
        active: true,
      });
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const selectedIcon = form.watch('icon');
  const IconComponent = getIconComponent(selectedIcon);

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    console.log("Form values being submitted:", values);
    onSubmit(values);
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please check the form for errors. Some required fields might be missing.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Title</FormLabel>
                <FormControl>
                  <Input placeholder="Full-Stack Web Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Tagline</FormLabel>
                <FormControl>
                  <Input placeholder="Build powerful, scalable web applications" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Statement</FormLabel>
                <FormControl>
                  <Input placeholder="Starting from $500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Color</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'blue'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['blue', 'green', 'red', 'purple', 'yellow', 'indigo'].map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                          <span className="capitalize">{color}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'Code'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon">
                        <div className="flex items-center gap-2">
                          {React.createElement(getIconComponent(field.value || 'Code'), { className: "w-4 h-4" })}
                          <span>{field.value || 'Code'}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableIcons.map((iconName) => {
                      const Icon = getIconComponent(iconName);
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Full service description including technical details..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Service Features (Key highlights)</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: '', description: '' })}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg bg-card/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Feature #{index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive h-8 w-8 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`features.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Feature Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. MERN Stack Development" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`features.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Feature Short Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Building robust apps with MongoDB, Express, React, Node.js" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          {form.formState.errors.features && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.features.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Show this service on the public page
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[150px] bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

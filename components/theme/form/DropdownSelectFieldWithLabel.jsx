import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import UIText from "@/components/theme/UIText";
import {Check, ChevronsUpDown, LockKeyhole, XIcon} from "lucide-react";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import * as React from "react";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {useI18n} from "@/locales/client";
import {useData} from "@/components/contexts/DataContext";

export const DropdownSelectFieldWithLabel = ({data, isOwner, fieldValue, onSelect, onClear, label}) =>{

    const [openDropdown, setOpenDropdown] = useState(false)
    const [selected, setSelected] = useState(fieldValue || '')
    const t = useI18n()
    const {userGroups} = useData()

    return(

        <div className="flex flex-col gap-2">
            <Label className={"relative text-sm flex items-center justify-between gap-4 text-white"}>
                <UIText variant={'label'} className="shrink-0" text={label}/>
            </Label>

            {!isOwner ?
                <div className={cn("flex justify-betweenp-3 border rounded-lg p-6 cursor-not-allowed")}>
                    <UIText text={userGroups.find((group)=> group.$id===fieldValue)?.name} className={'ltr:pr-14 rtl:pl-14'}/>
                    <span className={'absolute rtl:left-10 ltr:right-10'}><LockKeyhole className={'text-destructive'}/> </span>
                </div>
            :
                <div className={'flex items-center gap-4'}>
                <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "w-full justify-between text-muted py-4 dark:bg-transparent border-0 ring-[1.5px] ring-accent-foreground dark:ring-muted-foreground",
                                openDropdown && "ring-ring dark:ring-ring"
                            )}
                        >
                            {selected ?
                                <UIText text={data.find((item)=> item.$id === selected)?.name}/>
                                :
                                <UIText className={"text-muted-foreground rtl:pr-2"} text={t('labels.selectGroup')}/>
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 border-muted-foreground">
                        <Command className={'bg-accent dark:bg-black'}>
                            {/*<CommandInput placeholder={t('search')} />*/}
                            {/*<CommandEmpty><UIText text={t('noLanguagesFound')}/> </CommandEmpty>*/}
                            <CommandList>
                                <CommandGroup>
                                    {/*{userOwnedGroups.length===0 &&*/}
                                    {/*	<SelectItem value={null} className={'bg-accent-foreground'}>*/}
                                    {/*		<UIText className={'text-muted-foreground'} variant={'sm'} text={t('labels.noGroups')}/>*/}
                                    {/*	</SelectItem>*/}
                                    {/*}*/}
                                    {data?.map((group)=>(
                                        <CommandItem
                                            key={group.$id}
                                            value={group.$id}
                                            onSelect={(currentValue) => {
                                                setSelected(currentValue)
                                                onSelect && onSelect(currentValue)
                                                setOpenDropdown(false)
                                            }}
                                            className={cn(
                                                'gap-4',
                                                "bg-accent dark:bg-accent-foreground dark:hover:bg-accent-foreground aria-selected:bg-primary dark:aria-selected:bg-primary"
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-5 w-5 rtl:mt-1.5 stroke-[2.5] dark:text-muted",
                                                    selected === group.$id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <UIText text={t(group.name)}/>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {/* Clear Date Button */}
                {selected &&
                    <Button
                        variant={'outline'}
                        type={'button'}
                        size={'icon'}
                        onClick={()=>{
                            onClear()
                            setSelected('')
                        }}
                        className={'!w-10 !h-10 px-2 flex items-center justify-center text-destructive stroke-[2.5] hover:text-destructive'}
                    >
                        <XIcon className={'w-4 h-4'} />
                    </Button>
                }
            </div>
            }

        </div>
    )
}
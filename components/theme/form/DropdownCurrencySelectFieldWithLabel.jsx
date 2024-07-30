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
import {ClearFieldButton} from "@/components/theme/ClearFieldButton";

export const DropdownCurrencySelectFieldWithLabel = ({data, fieldValue, onSelect, onClear, label}) =>{

    const [openDropdown, setOpenDropdown] = useState(false)
    const [selected, setSelected] = useState(fieldValue || '')
    const t = useI18n()
    const {userGroups} = useData()

    return(

        <div className="flex flex-col gap-2">
            <Label className={"relative text-sm flex items-center justify-between gap-4"}>
                <UIText variant={'label'} className="shrink-0" text={label}/>
            </Label>

            <div className={'flex items-center gap-4'}>
                <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "w-full justify-between py-4 border-0 ring-[1.5px] ring-input focus-visible:ring-ring",
                                openDropdown && "ring-ring"
                            )}
                        >
                            {selected ?
                                <UIText text={t(`currencies.${data.find((item)=> item.name === selected)?.name}`)}/>
                                :
                                <UIText className={"rtl:pr-2"} text={t('labels.selectGroup')}/>
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 border-input">
                        <Command>
                            {/*<CommandInput placeholder={t('search')} />*/}
                            {/*<CommandEmpty><UIText text={t('noLanguagesFound')}/> </CommandEmpty>*/}
                            <CommandList>
                                <CommandGroup>
                                    {/*{userOwnedGroups.length===0 &&*/}
                                    {/*	<SelectItem value={null} className={'bg-accent-foreground'}>*/}
                                    {/*		<UIText className={'text-muted-foreground'} variant={'sm'} text={t('labels.noGroups')}/>*/}
                                    {/*	</SelectItem>*/}
                                    {/*}*/}
                                    {data?.map((item)=>(
                                        <CommandItem
                                            key={item.name}
                                            value={item.name}
                                            onSelect={(currentValue) => {
                                                setSelected(currentValue)
                                                onSelect && onSelect(currentValue)
                                                setOpenDropdown(false)
                                            }}
                                            className={cn('gap-4')}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-5 w-5 rtl:mt-1.5 stroke-[2.5]",
                                                    selected === item.name ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <UIText text={t(`currencies.${item.name}`)}/>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {fieldValue && onClear &&
                    <ClearFieldButton
                        onClick={()=>{
                            setSelected('')
                            onClear()
                        }}
                    />
                }
            </div>

        </div>
    )
}
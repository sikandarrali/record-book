import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {XIcon} from "lucide-react";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {cn} from "@/lib/utils";

export const SearchItems = ({openAddModal, setVisibleItems, itemsPerPage, itemsDefault}) =>{
    const [searchValue, setSearchValue] = useState("");
    const [searchResultsMessage, setSearchResultsMessage] = useState('')
    const t = useScopedI18n('events');

    const onSearch = (userValue) => {
        setSearchValue(userValue);
        if (userValue !== "") {
            const temp = itemsDefault?.filter((item) =>
                item.name.toLowerCase().includes(userValue.toLowerCase())
            );
            if(temp.length === 0){
                setSearchResultsMessage('searchNoItems')
            }else{
                setSearchResultsMessage('')
            }
            setVisibleItems(temp);
        }else{
            resetSearch()
        }
    };

    useEffect(() => {
        if(openAddModal){
            setSearchValue('')
            setSearchResultsMessage('')
            setVisibleItems(itemsDefault);
        }
    }, [openAddModal]);

    const resetSearch = () =>{
        setSearchValue('')
        setVisibleItems(itemsDefault.slice(0, itemsPerPage))
    }

    return(
        <div className="relative h-14 mb-4">
            <Input
                placeholder={t('searchPlaceholder')}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className={cn("h-full normal-case rtl:text-xl rtl:font-urdu", isStringUrdu(searchValue) ? 'font-urdu' : 'rtl:font-sans')}
            />

            {searchValue !== "" && (
                <XIcon
                    className="w-4 h-4 text-primary absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 ltr:mr-3 rtl:ml-3 cursor-pointer hover:scale-125 duration-300"
                    onClick={() => resetSearch()}
                />
            )}

            {searchValue !== '' && searchResultsMessage !== '' && (
                <div className="flex flex-col justify-center items-center gap-10 px-6 mt-20 text-destructive">
                    <UIText className="text-center text-lg font-medium">
                        {t(searchResultsMessage)}
                    </UIText>
                </div>
            )}
        </div>
    )
}
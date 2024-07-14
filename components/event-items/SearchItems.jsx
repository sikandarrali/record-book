import {useState} from "react";
import {Input} from "@/components/ui/input";
import {XIcon} from "lucide-react";
import {useTranslations} from "next-intl";

export const SearchItems = ({setVisibleItems, itemsPerPage, itemsDefault}) =>{
    const [searchValue, setSearchValue] = useState("");
    const [searchResultsMessage, setSearchResultsMessage] = useState('')
    const t = useTranslations('events');

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

    const resetSearch = () =>{
        setSearchValue('')
        setVisibleItems(itemsDefault.slice(0, itemsPerPage))
    }

    return(
        <div className="relative h-14 mb-4">
            <Input
                className="text-[16px] h-full normal-case"
                placeholder={t('searchPlaceholder')}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
            />

            {searchValue !== "" && (
                <XIcon
                    className="w-4 h-4 text-primary absolute right-0 top-1/2 -translate-y-1/2 mr-3 cursor-pointer hover:scale-125 duration-300"
                    onClick={() => resetSearch()}
                />
            )}

            {searchValue !== '' && searchResultsMessage !== '' && (
                <div className="flex flex-col justify-center items-center gap-10 px-6 mt-20">
                    <p className="text-center text-lg font-medium">
                        {t(searchResultsMessage)}
                    </p>
                </div>
            )}
        </div>
    )
}
"use client";
import FormLabel from "@/components/theme/FormLabel";
import { Form, Formik } from "formik";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
    Sheet,
    SheetContent, SheetDescription, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import useScrollToView from "@/lib/hooks/useScrollToView";
import {useMediaQuery} from "react-responsive";
import UIText from "@/components/theme/UIText";
import {cn, getCurrentCurrency, scrollToTop, SortItemsByDateAndCreatedAt} from "@/lib/utils";
import {ID, Permission, Query, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {useI18n} from "@/locales/client";
import {UITextInput} from "@/components/theme/UITextInput";
import {UITextArea} from "@/components/theme/UITextArea";
import {
    COLLECTION_ID_BOOKS_RECORDS,
    DATABASE_ID,
    databases,
    PARENT_BOOK_ID_FIELD_NAME
} from "@/components/appwrite/appwrite";
import {UINumberInput} from "@/components/theme/UINumberInput";
import {RecordSchema} from "@/lib/schemas/RecordSchema";
import { Toggle } from "@/components/ui/toggle"
import {Asterisk, ChevronDown, ChevronUp, Minus, Plus, Search, TrendingDown, TrendingUp, XIcon} from "lucide-react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {RecordTypeToggleGroup} from "@/components/record/RecordTypeToggleGroup";
import {UISheet} from "@/components/theme/UISheet";
import * as React from "react";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {NumberInputFieldWithLabel} from "@/components/theme/form/NumberInputFieldWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import {SingleRecord} from "@/components/record/SingleRecord";
import {db} from "@/components/appwrite/database";
import Loader from "@/components/loaders/loader";
import {SearchSchema} from "@/lib/schemas/SearchSchema";

// @TODO: store last type in localstorage

export const SearchSheet = ({open, onOpenChange, pageData}) => {

    const {user} = useAuth()
    const t = useI18n()
    const [items, setItems] = useState([])
    const [searchResultsMessage, setSearchResultsMessage] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    const onSearch = async (values) =>{
        setSearchLoading(true)

        try {
            const response = await db.records.list([
                Query.equal("pageId", pageData.$id),
                Query.search("name", values.value),
                Query.orderDesc("$createdAt"),
                Query.orderDesc("date"),
                Query.limit(-1)
            ]);

            if(response.documents.length === 0){
                setSearchResultsMessage('pages.records.noSearchItemsFound')
            } else{
                setSearchResultsMessage('')
            }

            setItems(response.documents);

            setTimeout(()=>{
                setSearchLoading(false)
            }, 2000)
        }
        catch (e){}
        finally {
            setShowResult(true);
            setSearchLoading(false)
        }
    }

    useEffect(() => {
        if(open){
            setShowResult(false)
            setSearchResultsMessage('');
        }
    }, [open]);

    return (
        <UISheet open={open} onOpenChange={onOpenChange} className={"h-[90vh] max-h-[90vh]"}>

            <div className={'flex justify-between items-center py-6 mb-4'}>
                <UIText className={"text-primary self-start"} weight={'semibold'} variant={'heading'} text={t('labels.searchRecords')}/>
            </div>

            <Formik
                initialValues={{
                    value: "",
                }}
                validationSchema={SearchSchema}
                onSubmit={(values) => {
                    onSearch(values);
                }}
            >
                {({
                      errors,
                      touched,
                      handleChange,
                      handleBlur
                  }) => (
                    <Form className={'w-full relative h-14 mb-4 flex flex-col gap-4'}>
                        <div className={'flex flex-1 -mt-2 gap-2 lg:gap-4'}>
                            <UITextInput
                                placeholder={t('pages.records.searchPlaceholder')}
                                className={cn('h-16', errors.value && touched.value && "ring-destructive")}
                                name={'value'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <Button className={'h-full shrink-0'} type={'submit'}>
                                <Search/>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>

            {searchLoading ?
                <Loader message={t('labels.searching')} />
                :
                showResult &&
                <>
                    <div className="flex flex-col justify-center items-center gap-6 px-6 mt-4 ">
                        {/* Number of Records & Search Result Items */}
                        <div className={cn(
                            'py-1.5 flex items-center justify-center px-6 gap-2 text-muted-foreground',
                        )}
                        >
                            <UIText text={t('pages.records.numOfItemsMatchingSearch')} weight={'medium'} className={cn((user?.prefs?.fontSize === "lg" || user?.prefs?.fontSize === "xl") && "rtl:-mt-4")}/>
                            <UIText variant={'heading'} weight={'bold'} className={'!text-primary rtl:-mt-1'} text={items.length}/>
                        </div>
                        <UIText variant={'heading'} weight={'medium'} textOrientation={'center'} className={'!text-destructive'} text={t(searchResultsMessage)}/>
                    </div>

                    {items.length > 0 &&
                        <div className={'flex flex-col'}>
                            <UIText text={'Search Results:'} weight={'semibold'} className={'mb-4 text-primary'}/>

                            {/* Records List */}
                            {SortItemsByDateAndCreatedAt(items).map((item, i) => (
                                <motion.div key={item.$id}>
                                    <SingleRecord item={item} bookCurrency={pageData?.currency} />
                                </motion.div>
                            ))}
                        </div>
                    }
                </>
            }

        </UISheet>
    );
};

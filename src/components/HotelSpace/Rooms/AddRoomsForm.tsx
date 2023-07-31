import React, { useCallback, useEffect, useRef } from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    Select,
    Button,
    RadioField,
} from "@element";
import useTranslation from "next-translate/useTranslation";

import { Controller, FieldArrayWithId } from "react-hook-form";

import { useRooms } from "@hooks/host-hotel";
import { DAY_OF_WEEK } from "@config";
import { useToast } from "@hooks/useToasts";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";

import { Room as RoomQueires } from "src/apollo/queries/hotel";
import { LoadingSpinner } from "src/components/LoadingSpinner";

const { queries: roomQueries } = RoomQueires;
interface IAddRoomFormProps {
    hotelId: string;
    handleSubmit?: any;
    toggleForm?: any;
    initialValue?: any;
    selectedRoom?: any;
}
interface IFields extends FieldArrayWithId {
    dayOfWeek: string;
    priceSchemeId: string;
}

const AddRoomForm = ({
    hotelId,
    handleSubmit,
    toggleForm,
    selectedRoom,
}: IAddRoomFormProps) => {
    const { t } = useTranslation("adminhost");
    // const {
    //     data: defaultRoomValue,
    //     loading: fetchingDefaultValue,
    //     refetch,
    // } = useQuery(roomQueries.ROOMS_BY_ID, {
    //     variables: { roomId: initialValue?.id },
    //     skip: true,
    //     fetchPolicy: "network-only",
    // });
    const { addAlert } = useToast();
    const router = useRouter();
    const {
        onSubmit,
        loading,
        errors,
        dirtyFields,
        control,
        register,
        getValues,
        fields,
        append,
        update,
        priceSchemes,
        priceSchemeLoading,
        onRemoveRoomPhoto,
        onAddHotelRoomPhotos,
        initialValue,
        fetchingRoomDetails,
        refetchRoomDetail,
    } = useRooms(hotelId, {
        fn: handleSubmit,
        // initialValue: defaultRoomValue?.hotelRoomById,
        selectedRoom,
        addAlert,
    });

    const handleUpload = useCallback(
        async (photo) => {
            onAddHotelRoomPhotos(photo)
                .then((data) => {
                    setTimeout(() => {
                        addAlert({
                            type: "success",
                            message: "Added photos successfully",
                        });
                        refetchRoomDetail();
                    }, 5000);
                })
                .catch((err) => {
                    addAlert({
                        type: "error",
                        message: "Could not add photos ",
                    });
                    refetchRoomDetail();
                });
        },
        [onAddHotelRoomPhotos, refetchRoomDetail]
    );

    if (fetchingRoomDetails)
        return <LoadingSpinner loadingText="読み込み中..." />;

    return (
        <form
            onSubmit={onSubmit}
            id="add-hotel-rooms"
            className="px-2 py-3 space-y-6 sm:py-6"
        >
            <div className="w-full lg:w-6/12 md:w-8/12">
                <div className="text-sm leading-5 font-medium">
                    ルームタイプ
                </div>
                <TextField
                    label={""}
                    {...register("name", {
                        required: true,
                    })}
                    error={errors.name && true}
                    errorMessage="Name is required"
                    autoFocus
                    disabled={loading}
                />
            </div>
            <div className="w-full lg:w-6/12 md:w-8/12">
                <div className="text-sm leading-5 font-medium">概要</div>
                <TextArea
                    label=""
                    {...register("description", {
                        required: true,
                    })}
                    errorMessage="Description is required"
                    error={errors.description && true}
                    rows={3}
                    disabled={loading}
                />
            </div>
            <div className="w-full lg:w-6/12 md:w-8/12">
                <div className="pb-2">
                    <h3 className="font-bold text-lg text-primary">画像</h3>
                    <div className="text-gray-500">
                        この情報は情報は一般に公開されますので、必ず有効な情報を追加してください。
                    </div>
                </div>
                <div className="text-sm text-gray-700 font-medium">
                    アップロードフォト
                </div>

                <Controller
                    rules={{
                        required: !initialValue?.photos?.length,
                    }}
                    control={control}
                    name="photos"
                    render={({ field: { onChange } }) => (
                        <FileUpload
                            id="room_form"
                            hideLabel
                            className="w-full"
                            label=""
                            error={errors.photos && true}
                            errorMessage="Photos are required"
                            onChange={(e) => onChange(e)}
                            defaultPhotos={initialValue?.photos}
                            onRemove={onRemoveRoomPhoto}
                            onUpload={handleUpload}
                        />
                    )}
                />
            </div>
            <div className="w-full lg:w-6/12 md:w-8/12">
                <div className="pb-2">
                    <div className="text-lg font-bold text-primary leading-6">
                        支払い種類
                    </div>
                </div>
                <Controller
                    rules={{ required: true }}
                    control={control}
                    name="paymentTerm"
                    render={({ field: { onChange } }) => (
                        <RadioField
                            label=""
                            disabled={loading}
                            onChange={(e) => onChange(e)}
                            error={errors?.paymentTerm && true}
                            defaultValue={getValues("paymentTerm")}
                            errorMessage="Payment Term is required"
                            options={[
                                {
                                    value: "PER_ROOM",
                                    label: "部屋ごと",
                                },
                                {
                                    value: "PER_PERSON",
                                    label: "人数ごと",
                                },
                            ]}
                        />
                    )}
                />
            </div>
            <div className="w-full lg:w-6/12 md:w-8/12">
                <div className="pb-2">
                    <div className="text-lg font-bold text-primary leading-6">
                        最大人数
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row space-x-0 space-y-2 sm:space-x-4 sm:space-y-0 ">
                    <div className="w-full">
                        <Controller
                            name={`maxCapacityAdult`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <>
                                    <div className="text-sm leading-5 font-medium text-gray-700">
                                        大人
                                    </div>
                                    <Select
                                        {...field}
                                        label={""}
                                        options={Array.from(Array(11)).map(
                                            (_, i) => ({
                                                value: i,
                                                label: i,
                                            })
                                        )}
                                        error={errors?.maxCapacityAdult && true}
                                        onChange={(event) => {
                                            field.onChange(event);
                                        }}
                                        valueKey="value"
                                        errorMessage="Adult Capacity is required"
                                        labelKey="label"
                                        disabled={loading}
                                    />
                                </>
                            )}
                        />
                    </div>

                    <div className="w-full">
                        <Controller
                            name={`maxCapacityChild`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <>
                                    <div className="text-sm leading-5 font-medium text-gray-700">
                                        子供
                                    </div>
                                    <Select
                                        {...field}
                                        label={""}
                                        options={Array.from(Array(11)).map(
                                            (_, i) => ({
                                                value: i,
                                                label: i,
                                            })
                                        )}
                                        error={errors?.maxCapacityChild && true}
                                        onChange={(event) => {
                                            field.onChange(event);
                                        }}
                                        errorMessage="Child Capacity is required"
                                        labelKey="label"
                                        valueKey="value"
                                        disabled={loading}
                                    />
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full  md:w-6/12">
                <div className="w-full pb-2 flex items-center justify-between">
                    <div className="text-lg font-bold text-primary leading-6">
                        在庫
                    </div>

                    <Button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/host/hotel-space/edit/${hotelId}/stockoverride/room/${initialValue?.id}`
                            )
                        }
                        // /host/hotel-space/edit/[HOTEL_ID]/priceoverride/room/[ROOM_ID]
                        className="max-w-min whitespace-nowrap  lg:w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                    >
                        在庫の上書き
                    </Button>
                </div>
                <TextField
                    label=""
                    {...register("stock", {
                        required: true,
                        min: 0,
                    })}
                    className="w-full md:w-3/12 "
                    errorMessage="Stock is required"
                    error={errors.stock && true}
                    type="number"
                    disabled={loading}
                />
            </div>
            <div className="w-full lg:w-6/12 md:w-8/12 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-lg font-bold text-primary leading-6">
                        基本料金設定
                    </div>
                    {priceSchemes?.myPriceSchemes?.length > 0 && (
                        <Button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/host/hotel-space/edit/${hotelId}/priceoverride/room/${initialValue?.id}`
                                )
                            }
                            // /host/hotel-space/edit/[HOTEL_ID]/priceoverride/room/[ROOM_ID]
                            className=" lg:w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                        >
                            料金の上書き
                        </Button>
                    )}
                </div>
                {priceSchemes?.myPriceSchemes?.length < 1 && (
                    <div className="space-y-1 text-sm text-center my-6 text-gray-500">
                        <div className="font-bold text-gray-600">
                            料金プラン登録されていません
                        </div>
                        <div>
                            料金の設定する前次のページから料金プランをご登録ください。
                        </div>
                    </div>
                )}
                {priceSchemes?.myPriceSchemes?.length > 0 && (
                    <div className="flex flex-wrap space-y-3 lg:space-y-0 ">
                        {DAY_OF_WEEK.map((pricing, index) => (
                            <div
                                className="flex w-full sm:w-20 py-2  flex-row items-center justify-between lg:flex-1 lg:flex-col lg:justify-between lg:items-center lg:border first:rounded-l-md last:rounded-r-md "
                                key={index}
                            >
                                <div className="text-xl">{pricing.name}</div>
                                <Controller
                                    name={`basicPriceSettings.${index}`}
                                    control={control}
                                    rules={{ required: false }}
                                    // defaultValue={
                                    //     initialValue?.address?.Prefecture?.id
                                    // }
                                    render={({ field }) => {
                                        return (
                                            <Select
                                                {...field}
                                                hidePlaceholder
                                                label={""}
                                                className="lg:w-16 "
                                                options={
                                                    priceSchemes?.myPriceSchemes ||
                                                    []
                                                }
                                                error={
                                                    errors?.prefecture && true
                                                }
                                                onChange={(event) => {
                                                    update(index, {
                                                        ...fields[index],
                                                        priceSchemeId: event,
                                                    });
                                                }}
                                                labelKey="name"
                                                valueKey="id"
                                                value={
                                                    fields?.length > 0
                                                        ? fields[index]
                                                              ?.priceSchemeId
                                                        : ""
                                                }
                                                errorMessage="Pricing is required"
                                                disabled={
                                                    loading ||
                                                    priceSchemeLoading ||
                                                    !priceSchemes
                                                        ?.myPriceSchemes?.length
                                                }
                                            />
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 border-t mt-4 pt-5 lg:w-6/12 md:w-8/12 sm:w-6/12  ">
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    loadingText="Adding Room"
                    className="bg-indigo-600 font-medium text-sm w-16 hover:bg-indigo-400"
                >
                    保存
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    disabled={loading}
                    onClick={toggleForm}
                    className="w-24"
                >
                    キャンセル
                </Button>
            </div>
        </form>
    );
};

export default AddRoomForm;

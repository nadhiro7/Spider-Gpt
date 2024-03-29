import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import { Input } from "../ui/input"
import Image from "next/image"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import { createGroup, updateGroup } from "@/lib/actions/group.actions"
import { usePathname, useRouter } from "next/navigation"
import { Group } from "@/types"

interface Props {
    open: boolean,
    handleClose: () => void,
    type: string,
    _id?: string,
    group?: Group
}
function AddGroup({ open, handleClose, _id, type, group }: Props) {
    const [name, setName] = useState<string>(group?.groupName ? group?.groupName : '')
    const [files, setFiles] = useState<File[]>([]);
    const [image, setImage] = useState<string>(group?.groupImage ? group?.groupImage : '');
    const { startUpload } = useUploadThing("media");
    const [create, setCreate] = useState<boolean>(false)
    const router = useRouter()
    const path = usePathname()
    const onSubmit = async () => {
        if (type === 'Add') {
            setCreate(true)
            const blob = image;
            const hasImageChanged = isBase64Image(blob);
            if (hasImageChanged) {
                const imgRes = await startUpload(files);
                if (imgRes && imgRes[0].fileUrl) {
                    setImage(imgRes[0].fileUrl)
                }
            }

            const newGroup = await createGroup(name, _id!, image, path)
            setName('')
            setImage('')
            setFiles([])
            setCreate(false)
            router.push('/groups/' + newGroup._id)
        } else {

            if (image !== group?.groupImage) {
                const imgRes = await startUpload(files);
                if (imgRes && imgRes[0].fileUrl) {
                    console.log(imgRes[0].fileUrl)
                    await updateGroup(name, path, imgRes[0].fileUrl)
                }
            } else {
                await updateGroup(name, path)
            }

            setFiles([])
        }
        handleClose()
    }
    const handleImage = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));
            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                setImage(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };
    return (
        <div className="bg-dark-2">
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle sx={{ color: '#fff' }}>{type} Group</DialogTitle>
                <DialogContent >
                    {type === 'Add' && (
                        <DialogContentText sx={{ color: '#fff' }}>
                            To create group please enter your group name here.
                        </DialogContentText>
                    )}
                    <label className="account-form_image_label mt-2 ml-5">
                        {image ? (
                            <Image
                                src={image}
                                alt={"profile photo"}
                                width={60}
                                height={60}
                                className="rounded-full object-cover w-[70px] h-[70px] "
                            />
                        ) : (
                            <Image
                                src={"/assets/profile.svg"}
                                alt={"profile photo"}
                                width={50}
                                height={50}
                                priority
                                className="object-contain rounded-full"
                            />
                        )}
                    </label>
                    <Input
                        type="file"
                        accept="image/*"
                        placeholder="Add profile photo"
                        className="account-form_image-input"
                        onChange={(e) => handleImage(e)}
                    />
                    <input
                        autoFocus
                        id="name"
                        placeholder="Group name"
                        className="bg-dark-2 no-focus w-full outline-none p-2 text-light-1 border-b-2 border-white border-solid"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <button className=" text-primary-500" onClick={handleClose}>Cancel</button>
                    {type === 'Add' ? (
                        <button className="disabled:text-gray-400 text-primary-500" onClick={onSubmit} disabled={name || create ? false : true}>{create ? 'Creating...' : 'Create'}</button>
                    ) : (
                        <button className="disabled:text-gray-400 text-primary-500" onClick={onSubmit}>{type}</button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddGroup
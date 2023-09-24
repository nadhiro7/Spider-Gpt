import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material"
import { ChangeEvent, useState } from "react"
import { Input } from "../ui/input"
import Image from "next/image"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import { usePathname, useRouter } from "next/navigation"
import { createBot } from "@/lib/actions/bot.actions"


interface Props {
    open: boolean,
    handleClose: () => void,
    _id: string
}
function AddBot({ open, handleClose, _id }: Props) {
    const [name, setName] = useState<string>('')
    const [files, setFiles] = useState<File[]>([]);
    const [image, setImage] = useState<string>('');
    const { startUpload } = useUploadThing("media");
    const [create, setCreate] = useState<boolean>(false)
    const router = useRouter()
    const path = usePathname()
    const [value, setValue] = useState('public');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };
    const onSubmit = async () => {
        setCreate(true)
        const blob = image;

        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) {
                setImage(imgRes[0].url)
            }
        }

        const bot = await createBot(name, _id, image, path, value)
        setName('')
        setImage('')
        setFiles([])
        setCreate(false)
        router.push('/bots/' + bot._id)
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
                <DialogTitle sx={{ color: '#fff' }}>Add Bot</DialogTitle>
                <DialogContent >
                    <DialogContentText sx={{ color: '#fff' }}>
                        To create bot please enter your bot name here.
                    </DialogContentText>
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
                        placeholder="bot name"
                        className="bg-dark-2 no-focus w-full outline-none p-2 text-light-1 border-b-2 border-white border-solid"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <FormControl sx={{ marginTop: '20px', color: 'white' }}>
                        <FormLabel id="demo-controlled-radio-buttons-group" sx={{ color: 'gray' }}>Type</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            row
                            onChange={handleChange}
                        >
                            <FormControlLabel value="public" control={<Radio sx={{
                                color: 'white',
                            }} />} label="Public" />
                            <FormControlLabel value="private" control={<Radio sx={{
                                color: 'white',
                            }} />} label="Private" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <button className=" text-primary-500" onClick={handleClose}>Cancel</button>
                    <button className="disabled:text-gray-400 text-primary-500" onClick={onSubmit} disabled={name || create ? false : true}>{create ? 'Creating...' : 'Create'}</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddBot
import Image from "next/image";
import { Name } from "./name";
import { Description } from "./description";

interface CardProfileProps {
    user: {
        id: string;
        name: string | null;
        username: string | null;
        bio: string | null;
        image: string | null;
    }
}

export function CardProfile({ user }: CardProfileProps) {
    return (
        <section className="w-full flex flex-col items-center mx-auto px-4">
            <div className="">
                <Image
                    src={user.image ?? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAOVBMVEX///+hoaGZmZmenp75+fmmpqbX19e3t7e/v7/t7e3n5+epqanNzc3KysqSkpL8/Pzf39/z8/OwsLBPkmpzAAAC40lEQVR4nO3a6W6rMBCGYbywmmDC/V9sTSAUEiASWGKQ3udXK3EQ3xmPF0qSAAAAAAAAAAAAAAAAAAAAAAAAAAAu4xNvY7o2TZZHVZRXhklNXNmFWbxSKmIUZeoLw1ildBVLWehLw4TKNPHu9iBMNIswYZ72/szdJIU5TUiYUBFbF0V9bpmQEiZpU2WUco8zdxMSJmlDkn7NUY/keNsICePNEEaptDp+NyFhska9FcfvJiRMod9ZTHf8bkLCdGYK447fTUiYx1QZdf/KVI1R6RBm/3F2j19CwiT5WBqT7j1u25m83J67hYTx3oXaKKPTnWdNWhdOLDtzt5Aw4afMGZM+9upSvqYJkz+3LhATJrSDfdq95d+O87euty6TE2Z3F9MfDTI1zt9ma6DJCfPjwtAw0+ydbmyu7xImKfP/pUgX621zlzD+Me0R+jTZ6pH0LmGmhhnTrLbNLcL4pHJaLbjnyoxxizDJs/jIovTainSLML7+zBL+Wft9ncgwtprPVmFWXjbMuNp8b3wkhql0o+fnzapbyRJOcV8DTWCYUpt+KZl+/26YcaB9tY24MN6613ayP9cMw2ilYcZJ4LNtxIWx46HTuHEpqdK1Qfa6RH1sBMSFad/vaUz+GkXzbcxXabrl/llWGJ+Us//4vm22GmZsm9rLDZPYWR1MmoVtjN4aZK9LmsW2RlYYXzfzR+3K7YYZL1F2VhtZYapm+ajdTsMMdG5lhvHPMLSWafbr0l+haz9NAqLC/KzDam3+20ZSmOxIlvmbNkFhykNZ+raRN8zs7wbZMJ0GxITxu6vjj9qMb2vEhDnWMAPjhhlNSphyd6X/WZrh77pCwnh3Jsu7bYSEOdEwY236tzUywrTN2Y+zdOeFVMam7jSVCQnzLCOoJITR8T43vTiM7Q+U0bhrP2v04XilY+kngivDJHkalTvx5c15ZRbVpVmiO/VZJAAAAAAAAAAAAAAAAAAAAAAAAABc4A+lUzEyY9gMcgAAAABJRU5ErkJggg=="}
                    alt="Foto de perfil"
                    width={104}
                    height={104}
                    className="rounded-x1 bg-gray-50 object-cover border-4 border-white hover:shadow-xl duration-300"
                    priority
                    quality={100}
                />
            </div>
            <div>
                <Name
                    initialName={user.name ?? "Digite seu nome..."}
                />
                <Description
                    initiaDescription={user.bio ?? "Digite uma breve descrição..."}
                />
            </div>
        </section>
    )
}
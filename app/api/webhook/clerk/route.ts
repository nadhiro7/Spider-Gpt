import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";

import { IncomingHttpHeaders } from "http";

import { NextResponse } from "next/server"
import { createOrUpdateUser, deleteUser, updateSession } from "@/lib/actions/user.actions";

type EventType =
    | "user.created"
    | "email.created"
    | "user.updated"
    | "user.deleted"
    | "session.created"
    | "session.ended"
    | "session.removed";
type Event = {
    data: any;
    object: "event";
    type: EventType;
};
export function GET(request: Request) {
    return new NextResponse('hello', { status: 200 })
}
export async function POST(request: Request) {
    const payload = await request.json();
    const header = headers();

    const heads = {
        "svix-id": header.get("svix-id"),
        "svix-timestamp": header.get("svix-timestamp"),
        "svix-signature": header.get("svix-signature"),
    };

    // Activitate Webhook in the Clerk Dashboard.
    // After adding the endpoint, you'll see the secret on the right side.
    const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

    let evnt: Event | null = null;

    try {
        evnt = wh.verify(
            JSON.stringify(payload),
            heads as IncomingHttpHeaders & WebhookRequiredHeaders
        ) as Event;
    } catch (err) {
        return NextResponse.json({ message: err }, { status: 400 });
    }

    const eventType: EventType = evnt?.type!;

    // Listen organization creation event
    if (eventType === "user.created") {
        // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
        // Show what evnt?.data sends from above resource
        const { id, first_name, birthday, email_addresses, image_url, last_name, gender, username } =
            evnt?.data ?? {};

        try {
            // @ts-ignore
            console.log("user created");
            await createOrUpdateUser({ id, username, birthday, gender, image: image_url, name: first_name + ' ' + last_name, email: email_addresses[0].email_address })

            return NextResponse.json({ message: "User created" }, { status: 201 });
        } catch (err) {
            console.log(err);
            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }



    // Listen member deletion event
    if (eventType === "user.deleted") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
            // Show what evnt?.data sends from above resource
            const { id } = evnt?.data;
            console.log("removed");

            await deleteUser(id)
            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    // Listen organization updation event
    if (eventType === "user.updated") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource
            const { id, first_name, birthday, email_addresses, image_url, last_name, gender, username } = evnt?.data ?? {};
            console.log(eventType);

            await createOrUpdateUser({ id, username, birthday, gender, image: image_url, name: first_name + ' ' + last_name, email: email_addresses[0].email_address })


            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }
    if (eventType === "session.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource
            console.log(eventType);
            console.log(evnt?.data)
            const { user_id, status, abandon_at } = evnt?.data;
            const dt = new Date(abandon_at)
            await updateSession({ user_id, session: status, active_at: dt })



            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }
    if (eventType === "session.ended") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource
            console.log(eventType);
            const { user_id, status, abandon_at } = evnt?.data;
            const dt = new Date(abandon_at)
            await updateSession({ user_id, session: status, active_at: dt })



            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }
    if (eventType === "session.removed") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource

            const { user_id, status, abandon_at } = evnt?.data;
            const dt = new Date(abandon_at)
            await updateSession({ user_id, session: status, active_at: dt })

            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }
};

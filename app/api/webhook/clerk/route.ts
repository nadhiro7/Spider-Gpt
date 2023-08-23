import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";

import { IncomingHttpHeaders } from "http";

import { NextResponse } from "next/server";
import { createUser, updateUser } from "@/lib/actions/user.actions";
import next from "next";

type EventType =
    | "user.created"
    | "email.created"
    | "user.updated"
    | "user.deleted";
type Event = {
    data: any;
    object: "event";
    type: EventType;
};
export function GET(request: Request) {
    return new NextResponse('hello', { status: 200 })
}
export const POST = async (request: Request) => {
    console.log('sdadsad')
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
        // const { id, first_name, birthday, email_addresses, image_url, last_name, gender, username } =
        //     evnt?.data ?? {};

        try {
            // @ts-ignore
            console.log("user created", evnt?.data);
            // await createUser({ id, username, birthday, gender, image: image_url, name: first_name + ' ' + last_name, email: email_addresses.email_address })

            return NextResponse.json({ message: "User created" }, { status: 201 });
        } catch (err) {
            console.log(err);
            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    // Listen organization invitation creation event.
    // Just to show. You can avoid this or tell people that we can create a new mongoose action and
    // add pending invites in the database.
    if (eventType === "email.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
            console.log("email created", evnt?.data);

            return NextResponse.json(
                { message: "Invitation created" },
                { status: 201 }
            );
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
            const { organization, public_user_data } = evnt?.data;
            console.log("removed", evnt?.data);


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
            console.log("updated", evnt?.data);

            await updateUser({ id, username, birthday, gender, image: image_url, name: first_name + ' ' + last_name, email: email_addresses.email_address })


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
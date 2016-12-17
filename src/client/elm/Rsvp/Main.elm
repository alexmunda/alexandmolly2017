module Rsvp.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


main =
    Html.beginnerProgram
        { model = model
        , view = view
        , update = update
        }


type alias Model =
    { guests : List Guest
    , attending : Bool
    }


type alias Guest =
    { firstName : String
    , lastName : String
    , id : Int
    }


model : Model
model =
    Model [ Guest "" "" 1 ] True


type Msg
    = FirstName Int String
    | LastName Int String
    | ToggleAttending Bool
    | AddGuest
    | RemoveGuest Int


update : Msg -> Model -> Model
update msg model =
    case msg of
        FirstName guestId firstName ->
            let
                updateFirstName guest =
                    if guest.id == guestId then
                        { guest | firstName = firstName }
                    else
                        guest
            in
                { model | guests = List.map updateFirstName model.guests }

        LastName id lastName ->
            let
                updateLastName guest =
                    if guest.id == id then
                        { guest | lastName = lastName }
                    else
                        guest
            in
                { model | guests = List.map updateLastName model.guests }

        ToggleAttending attending ->
            { model | attending = attending }

        AddGuest ->
            let
                guest =
                    Guest "" "" <| List.length model.guests + 1
            in
                { model | guests = model.guests ++ [ guest ] }

        RemoveGuest guestId ->
            let
                removeGuest guest =
                    guest.id /= guestId
            in
                { model | guests = List.filter removeGuest model.guests }


view : Model -> Html Msg
view model =
    div []
        [ fieldset []
            [ radio "Attending" <| ToggleAttending True
            , radio "Not Attending" <| ToggleAttending False
            ]
        , div [] (guestList model)
        , button [ class "btn btn-default", onClick AddGuest ] [ text "Add Guest" ]
        , div []
            [ button [ class "btn btn-primary" ] [ text "Submit RSVP" ]
            ]
        ]


guestNames : Guest -> Html Msg
guestNames guest =
    div []
        [ input [ type_ "text", placeholder "First Name", onInput <| FirstName guest.id ] []
        , input [ type_ "text", placeholder "Last Name", onInput <| LastName guest.id ] []
        , removeGuestButton guest.id
        ]


guestList : Model -> List (Html Msg)
guestList model =
    List.map guestNames model.guests


radio : String -> Msg -> Html Msg
radio value msg =
    label
        []
        [ input [ type_ "radio", name "font-size", onClick msg ] []
        , text value
        ]


removeGuestButton : Int -> Html Msg
removeGuestButton guestId =
    if guestId == 1 then
        span [] []
    else
        button [ class "btn btn-danger", onClick <| RemoveGuest guestId ] [ text "Remove Guest" ]

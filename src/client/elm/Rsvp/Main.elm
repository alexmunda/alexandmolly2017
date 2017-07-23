module Rsvp.Main exposing (..)

import Date exposing (..)
import Form exposing (Form)
import Form.Field
import Form.Validate as Validate exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http exposing (get, send)
import Json.Decode as Json
import Json.Decode.Pipeline as Pipeline exposing (decode)
import RemoteData exposing (WebData)
import Util.Extra exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }


type alias Rsvp =
    { guest : Guest
    , party : Party
    }


type alias Party =
    { partyId : Int
    , displayName : String
    , maxPartySize : Int
    , partySize : Int
    , attending : Maybe Bool
    , rsvpOn : Maybe Date.Date
    }


type alias Guest =
    { firstName : String
    , lastName : String
    , guestId : Int
    , partyId : Int
    , rsvpOn : Maybe Date
    }


type alias FindGuest =
    { rsvp : RemoteData.WebData Rsvp
    , findGuestForm : Form () GuestForm
    }


type alias RsvpParty =
    { rsvp : Rsvp
    , rsvpForm : RsvpForm
    , saveRsvp : RemoteData.WebData Rsvp
    }


type alias GuestForm =
    { firstName : String
    , lastName : String
    }


type alias RsvpForm =
    { attending : Bool
    , partySize : Int
    }


type Model
    = FindingGuest FindGuest
    | RsvpingParty RsvpParty


validateFindGuest : Validation () GuestForm
validateFindGuest =
    Validate.map2 GuestForm
        (Validate.field "first_name" string)
        (Validate.field "last_name" string)


initialFindGuestForm : Form () GuestForm
initialFindGuestForm =
    Form.initial [] validateFindGuest


initialModel : Model
initialModel =
    FindingGuest (FindGuest RemoteData.NotAsked initialFindGuestForm)


type RsvpMsg
    = IncrementPartySize
    | DecrementPartySize
    | Attending
    | NotAttending


type Msg
    = FindGuestFormMsg Form.Msg
    | RsvpFormMsg RsvpMsg
    | FetchGuestResponse (RemoteData.WebData Rsvp)
    | SubmitRsvpForm
    | SaveRsvpResponse (RemoteData.WebData Rsvp)


fromResult : Result String a -> Json.Decoder a
fromResult result =
    case result of
        Ok successValue ->
            Json.succeed successValue

        Err errorMessage ->
            Json.fail errorMessage


unsafeDate : Json.Decoder Date.Date
unsafeDate =
    Json.string
        |> Json.andThen (Date.fromString >> fromResult)


guestDecoder : Json.Decoder Guest
guestDecoder =
    decode Guest
        |> Pipeline.required "first_name" Json.string
        |> Pipeline.required "last_name" Json.string
        |> Pipeline.required "guest_id" Json.int
        |> Pipeline.required "party_id" Json.int
        |> Pipeline.required "rsvp_on" (Json.maybe unsafeDate)


partyDecoder : Json.Decoder Party
partyDecoder =
    decode Party
        |> Pipeline.required "party_id" Json.int
        |> Pipeline.required "display_name" Json.string
        |> Pipeline.required "max_party_size" Json.int
        |> Pipeline.required "party_size" Json.int
        |> Pipeline.required "attending" (Json.maybe Json.bool)
        |> Pipeline.required "rsvp_on" (Json.maybe unsafeDate)


rsvpDecoder : Json.Decoder Rsvp
rsvpDecoder =
    decode Rsvp
        |> Pipeline.required "guest" guestDecoder
        |> Pipeline.required "party" partyDecoder


fetchGuest : (RemoteData.RemoteData Http.Error Rsvp -> msg) -> GuestForm -> Cmd msg
fetchGuest typeTransformer guestForm =
    let
        url =
            "/api/guests?first_name=" ++ guestForm.firstName ++ "&last_name=" ++ guestForm.lastName
    in
        get url rsvpDecoder |> send (RemoteData.fromResult >> typeTransformer)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        FindingGuest findGuest ->
            case msg of
                FindGuestFormMsg formMsg ->
                    let
                        newForm =
                            Form.update validateFindGuest formMsg findGuest.findGuestForm

                        formOutput =
                            case formMsg of
                                Form.Submit ->
                                    Form.getOutput newForm

                                _ ->
                                    Nothing
                    in
                        ( FindingGuest { findGuest | findGuestForm = newForm }
                        , formOutput
                            |> Maybe.map (fetchGuest FetchGuestResponse)
                            |> Maybe.withDefault Cmd.none
                        )

                FetchGuestResponse guestResponse ->
                    case guestResponse of
                        RemoteData.Success rsvp ->
                            let
                                initialRsvpForm =
                                    { attending = True, partySize = rsvp.party.maxPartySize }
                            in
                                ( RsvpingParty (RsvpParty rsvp initialRsvpForm RemoteData.NotAsked), Cmd.none )

                        _ ->
                            ( FindingGuest { findGuest | rsvp = guestResponse }, Cmd.none )

                RsvpFormMsg _ ->
                    ( model, Cmd.none )

                SubmitRsvpForm ->
                    ( model, Cmd.none )

                SaveRsvpResponse _ ->
                    ( model, Cmd.none )

        RsvpingParty rsvpParty ->
            case msg of
                RsvpFormMsg formMsg ->
                    ( RsvpingParty { rsvpParty | rsvpForm = updateRsvpForm formMsg rsvpParty.rsvpForm rsvpParty.rsvp.party.maxPartySize }, Cmd.none )

                SubmitRsvpForm ->
                    ( model, Cmd.none )

                SaveRsvpResponse rsvpResponse ->
                    ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )


updateRsvpForm : RsvpMsg -> RsvpForm -> Int -> RsvpForm
updateRsvpForm msg rsvpForm maxPartySize =
    case msg of
        IncrementPartySize ->
            let
                newPartySize =
                    if rsvpForm.partySize < maxPartySize then
                        rsvpForm.partySize + 1
                    else
                        rsvpForm.partySize
            in
                { rsvpForm | partySize = newPartySize }

        DecrementPartySize ->
            let
                newPartySize =
                    if rsvpForm.partySize > 1 then
                        rsvpForm.partySize - 1
                    else
                        rsvpForm.partySize
            in
                { rsvpForm | partySize = newPartySize }

        Attending ->
            { rsvpForm | attending = True }

        NotAttending ->
            { rsvpForm | attending = False }


renderFindGuestForm : Form () GuestForm -> Html Msg
renderFindGuestForm findGuestForm =
    Html.form [ class "form-horizontal guest-form", onSubmit (FindGuestFormMsg Form.Submit) ]
        [ h4 [ class "row" ]
            [ div [ class "col-md-12 text-center" ] [ text "RSVP" ]
            ]
        , div [ class "row" ]
            [ div [ class "col-md-12" ]
                [ Html.map FindGuestFormMsg <|
                    focusTextGroup "First Name"
                        (Form.getFieldAsString "first_name" findGuestForm)
                ]
            ]
        , div [ class "row" ]
            [ div [ class "col-md-12" ]
                [ Html.map FindGuestFormMsg <|
                    textGroup "Last Name"
                        (Form.getFieldAsString "last_name" findGuestForm)
                ]
            ]
        , div [ class "row" ]
            [ div [ class "col-md-12" ]
                [ button
                    [ class "btn btn-default"
                    ]
                    [ text "Find Invitation" ]
                ]
            ]
        ]


renderRsvpForm : RsvpForm -> Rsvp -> Html Msg
renderRsvpForm rsvpForm rsvp =
    Html.form [ class "form-horizontal guest-form rsvp", onSubmit SubmitRsvpForm ]
        [ h4 [ class "row" ]
            [ div [ class "col-md-12 text-center" ] [ text rsvp.party.displayName ]
            ]
        , div [ class "row" ]
            [ div [ class "col-md-12" ]
                [ div [ class "radio" ]
                    [ Html.map RsvpFormMsg <|
                        label [ onClick Attending ]
                            [ input
                                [ name "attending"
                                , type_ "radio"
                                , checked rsvpForm.attending
                                ]
                                []
                            , span [] [ text "Accepts with pleasure." ]
                            ]
                    ]
                , div [ class "radio" ]
                    [ Html.map RsvpFormMsg <|
                        label [ onClick NotAttending ]
                            [ input
                                [ name "attending"
                                , type_ "radio"
                                , checked (not rsvpForm.attending)
                                ]
                                []
                            , span [] [ text "Declines with regret." ]
                            ]
                    ]
                ]
            ]
        , numberOfGuestsRow rsvpForm
        , div [ class "row rsvp-row" ]
            [ div [ class "col-md-12" ]
                [ button
                    [ class "btn btn-default"
                    ]
                    [ text "RSVP" ]
                ]
            ]
        ]


numberOfGuestsRow : RsvpForm -> Html Msg
numberOfGuestsRow rsvpForm =
    if rsvpForm.attending then
        div [ class "row rsvp-row" ]
            [ div [ class "col-md-12" ]
                [ div [ class "form-group" ]
                    [ div [ class "col-md-12" ]
                        [ label [ class "control-label" ] [ text "Number of Guests" ] ]
                    , div [ class "col-xs-6" ]
                        [ Html.map RsvpFormMsg <|
                            div [ class "input-group" ]
                                [ span [ class "input-group-btn" ]
                                    [ button
                                        [ class "btn btn-default btn-number"
                                        , type_ "button"
                                        , onClick DecrementPartySize
                                        , disabled (rsvpForm.partySize == 0)
                                        ]
                                        [ i [ class "fa fa-minus" ]
                                            []
                                        ]
                                    ]
                                , span [ class "form-control input-number text-center" ]
                                    [ text (toString rsvpForm.partySize) ]
                                , span [ class "input-group-btn" ]
                                    [ button
                                        [ class "btn btn-default btn-number"
                                        , type_ "button"
                                        , onClick IncrementPartySize
                                        ]
                                        [ i [ class "fa fa-plus" ]
                                            []
                                        ]
                                    ]
                                ]
                        ]
                    ]
                ]
            ]
    else
        text ""


view : Model -> Html Msg
view model =
    case model of
        FindingGuest findGuest ->
            div [ class "form-container" ]
                [ (if RemoteData.isFailure findGuest.rsvp then
                    div [ class "guest-error" ]
                        [ div [ class "alert alert-danger text-center" ]
                            [ span []
                                [ text "Unable to find your invitation. Please "
                                , a [ href "mailto:alex.molly.munda@gmail.com" ] [ text "contact us" ]
                                , text "."
                                ]
                            ]
                        ]
                   else
                    text ""
                  )
                , renderFindGuestForm findGuest.findGuestForm
                ]

        RsvpingParty rsvpParty ->
            div [ class "form-container" ]
                [ (if RemoteData.isFailure rsvpParty.saveRsvp then
                    div [ class "guest-error" ]
                        [ div [ class "alert alert-danger text-center" ]
                            [ span []
                                [ text "Unable to save your RSVP. Please "
                                , a [ href "mailto:alex.molly.munda@gmail.com" ] [ text "contact us" ]
                                , text "."
                                ]
                            ]
                        ]
                   else
                    text ""
                  )
                , renderRsvpForm rsvpParty.rsvpForm rsvpParty.rsvp
                ]

module Photos.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import List.Extra exposing (greedyGroupsOf)
import Keyboard.Extra


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type Msg
    = PhotoSelected Photo
    | PhotoClosed
    | NextPhoto
    | PreviousPhoto
    | KeyboardMsg Keyboard.Extra.Msg


type alias Photo =
    { index : Int
    , url : String
    }


type alias Model =
    { selectedPhoto : Maybe Photo
    , previousPhotos : List Photo
    , nextPhotos : List Photo
    , photos : List Photo
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.map KeyboardMsg Keyboard.Extra.subscriptions


initialModel : Model
initialModel =
    { photos = List.map createPhoto <| List.range 1 49
    , selectedPhoto = Nothing
    , previousPhotos = []
    , nextPhotos = []
    }


createPhoto : Int -> Photo
createPhoto photoId =
    { index = photoId
    , url = buildPhotoUrl photoId
    }


buildPhotoUrl : Int -> String
buildPhotoUrl photoId =
    "/assets/images/photos/" ++ toString photoId ++ ".jpg"


handleNextPhoto : Model -> Model
handleNextPhoto model =
    let
        selectedPhoto =
            case List.head model.nextPhotos of
                Just nextPhoto ->
                    Just nextPhoto

                Nothing ->
                    model.selectedPhoto

        nextPhotos =
            if selectedPhoto == model.selectedPhoto then
                model.nextPhotos
            else
                case selectedPhoto of
                    Just photo ->
                        List.drop 1 model.nextPhotos

                    Nothing ->
                        model.nextPhotos

        previousPhotos =
            if selectedPhoto == model.selectedPhoto then
                model.previousPhotos
            else
                case ( selectedPhoto, model.selectedPhoto ) of
                    ( Just newSelectedPhoto, Just oldSelectedPhoto ) ->
                        oldSelectedPhoto :: model.previousPhotos

                    ( _, _ ) ->
                        model.previousPhotos
    in
        { model
            | selectedPhoto = selectedPhoto
            , previousPhotos = previousPhotos
            , nextPhotos = nextPhotos
        }


handlePreviousPhoto : Model -> Model
handlePreviousPhoto model =
    let
        selectedPhoto =
            case List.head model.previousPhotos of
                Just previousPhoto ->
                    Just previousPhoto

                Nothing ->
                    model.selectedPhoto

        nextPhotos =
            if selectedPhoto == model.selectedPhoto then
                model.nextPhotos
            else
                case ( selectedPhoto, model.selectedPhoto ) of
                    ( Just newSelectedPhoto, Just oldSelectedPhoto ) ->
                        oldSelectedPhoto :: model.nextPhotos

                    ( _, _ ) ->
                        model.nextPhotos

        previousPhotos =
            if selectedPhoto == model.selectedPhoto then
                model.previousPhotos
            else
                case selectedPhoto of
                    Just photo ->
                        List.drop 1 model.previousPhotos

                    Nothing ->
                        model.previousPhotos
    in
        { model
            | selectedPhoto = selectedPhoto
            , previousPhotos = previousPhotos
            , nextPhotos = nextPhotos
        }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PhotoSelected photo ->
            ( { model
                | selectedPhoto = Just photo
                , previousPhotos = (List.drop 1 << List.reverse << List.take photo.index) model.photos
                , nextPhotos = List.drop photo.index model.photos
              }
            , Cmd.none
            )

        PhotoClosed ->
            ( { model | selectedPhoto = Nothing }, Cmd.none )

        NextPhoto ->
            ( handleNextPhoto model, Cmd.none )

        PreviousPhoto ->
            ( handlePreviousPhoto model, Cmd.none )

        KeyboardMsg keyMsg ->
            let
                newModel =
                    Maybe.map getNewModel model.selectedPhoto |> Maybe.withDefault model

                state =
                    Keyboard.Extra.update keyMsg Keyboard.Extra.initialState

                arrow =
                    Keyboard.Extra.arrowsDirection state

                getNewModel selectedPhoto =
                    case model.selectedPhoto of
                        Just photo ->
                            case arrow of
                                Keyboard.Extra.West ->
                                    handlePreviousPhoto model

                                Keyboard.Extra.East ->
                                    handleNextPhoto model

                                _ ->
                                    model

                        Nothing ->
                            model
            in
                ( newModel, Cmd.none )


renderPhotoCol : Photo -> Html Msg
renderPhotoCol photo =
    div [ class "col col-sm-3" ]
        [ div [ class "thumbnail", style [ ( "border", "none" ) ] ]
            [ img [ onClick <| PhotoSelected photo, src photo.url ] []
            ]
        ]


renderPhotoRows : List Photo -> List (Html Msg)
renderPhotoRows photos =
    let
        renderRow groups =
            List.map renderPhotoCol groups |> div [ class "row" ]
    in
        greedyGroupsOf 4 photos |> List.map renderRow


view : Model -> Html Msg
view model =
    div [ class "container photo-container" ] <|
        renderPhotoRows model.photos
            ++ case model.selectedPhoto of
                Just selectedPhoto ->
                    [ div [ class "gallery-overlay", onClick PhotoClosed ]
                        []
                    , div
                        [ class "gallery" ]
                        [ div [ class "gallery-closeTarget", onClick PhotoClosed ] []
                        , div [ class "col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 gallery-media" ]
                            [ span []
                                [ i
                                    ([ class "fa fa-chevron-left left-arrow arrow"
                                     ]
                                        ++ if selectedPhoto.index == 1 then
                                            [ class "hidden" ]
                                           else
                                            [ onClick PreviousPhoto
                                            ]
                                    )
                                    []
                                ]
                            , img [ class "media-image img img-responsive", src selectedPhoto.url ] []
                            , span []
                                [ i
                                    ([ class "fa fa-chevron-right right-arrow arrow"
                                     ]
                                        ++ if selectedPhoto.index == List.length model.photos then
                                            [ class "hidden" ]
                                           else
                                            [ onClick NextPhoto
                                            ]
                                    )
                                    []
                                ]
                            ]
                        ]
                    ]

                Nothing ->
                    [ span [] [] ]
